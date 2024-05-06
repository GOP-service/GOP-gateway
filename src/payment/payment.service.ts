import { Injectable } from '@nestjs/common';
import { CreateBillDto } from './dto/create-bill.dto';
import { UpdateBillDto } from './dto/update-bill.dto';
import * as crypto from 'crypto';
import * as qs from 'qs';
import { format } from 'date-fns';
import { Bill, BillDocument } from './entities/bill.schema';
import { Ledger, LedgerDocument } from './entities/ledger.schema';
import { BillStatus, OrderType, PaymentMethod } from 'src/utils/enums';
import { Order, OrderDetails } from 'src/order/entities/order.schema';
import { DeliveryOrder, DeliveryOrderDocument } from 'src/order/entities/delivery_order.schema';
import { TransportOrder, TransportOrderDocument } from 'src/order/entities/transport_order.schema';
import { error, log } from 'console';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { Promotion, PromotionDocument } from './entities/promotion.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PromotionType } from 'src/utils/enums';
import { UpdatePromotionDto } from './dto/update-promotion.dto';

@Injectable()
export class PaymentService {
    constructor(
      @InjectModel(Bill.name) private readonly billModel: Model<BillDocument>,
      @InjectModel(Ledger.name) private readonly ledgerModel: Model<LedgerDocument>,
      @InjectModel(Promotion.name) private readonly promotionModdel: Model<PromotionDocument>
    ) {}

    getURLVnPay(ip: string, amount: number, orderId: string) {
        const date = new Date();
        let tmnCode = '0NDLY2ZY';
        let secretKey = 'DGCULOB4IRXO70APD55EP36RID3LL2LJ';
        let vnpUrl = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
        let returnUrl = 'https://gop-payment.vercel.app/user/payment';
        let locale = 'vn';
        let currCode = 'VND';
        let vnp_Params = {};
    
        vnp_Params['vnp_Version'] = '2.1.0';
        vnp_Params['vnp_Command'] = 'pay';
        vnp_Params['vnp_TmnCode'] = tmnCode;
        vnp_Params['vnp_Locale'] = locale;
        vnp_Params['vnp_CurrCode'] = currCode;
        vnp_Params['vnp_TxnRef'] = orderId;
        vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD: ' + orderId;
        vnp_Params['vnp_OrderType'] = 'other';
        vnp_Params['vnp_Amount'] = amount;
        vnp_Params['vnp_ReturnUrl'] = returnUrl;
        vnp_Params['vnp_IpAddr'] = ip;
        vnp_Params['vnp_CreateDate'] = format(date, 'yyyyMMddHHmmss');;
        vnp_Params['vnp_BankCode'] = 'NCB';
    
        vnp_Params = this.sortObject(vnp_Params);
    
        let signData = qs.stringify(vnp_Params, { encode: false });
        let hmac = crypto.createHmac("sha512", secretKey);
        let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex"); 
        vnp_Params['vnp_SecureHash'] = signed;
        vnpUrl += '?' + qs.stringify(vnp_Params, { encode: false });
    
        return vnpUrl;
      }
    
    sortObject(obj) {
        let sorted = {};
        let str = [];
        let key;
        for (key in obj){
          if (obj.hasOwnProperty(key)) {
          str.push(encodeURIComponent(key));
          }
        }
        str.sort();
          for (key = 0; key < str.length; key++) {
              sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
          }
          return sorted;
      }

    async createBill(createBillDto: CreateBillDto) {
      const new_bill = new this.billModel({
        payment_method: createBillDto.payment_method,
      });

      //todo check promotion các kiểu đà điểu
      let discount = 0;

      //todo tính tiền từ promotion
      if (createBillDto.order instanceof DeliveryOrder) {
        new_bill.sub_total = createBillDto.order.delivery_fare + createBillDto.order.order_cost;
      } else if (createBillDto.order instanceof TransportOrder){
        new_bill.sub_total = createBillDto.order.trip_fare;        
      }

      new_bill.discount = discount;
      new_bill.total = new_bill.sub_total - discount + new_bill.platform_fee;

      return await new_bill.save();
    }

    async updateBill(id: string, updateBillDto: UpdateBillDto) {
      return 
    }

    async getBill(id: string): Promise<BillDocument> {
      return await this.billModel.findById(id).exec();
    }

    async updateBillPaid(order : OrderDetails) {
      const bill = await this.billModel.findOne(order.bill).exec();

      bill.status = BillStatus.PAID;

      if (order instanceof DeliveryOrder) {
        if (bill.payment_method === PaymentMethod.VNPAY) {
          // update ledger for restaurant and driver with 90% profit
          this.updateLedger(order.restaurant_id, order, order.order_cost * 0.9);
          this.updateLedger(order.driver_id, order, order .delivery_fare * 0.9);
        } else if (bill.payment_method === PaymentMethod.CASH){
          // Update ledgers for restaurant and drivers pay 10% of profits for the platform
          this.updateLedger(order.restaurant_id, order, order.order_cost * -0.1);
          this.updateLedger(order.driver_id, order, order.delivery_fare * -0.1);
        }
      } else if (order instanceof TransportOrder){
        if (bill.payment_method === PaymentMethod.VNPAY) {
          // update ledger for driver with 90% profit
          this.updateLedger(order.driver_id, order, order.trip_fare * 0.9);
        } else if (bill.payment_method === PaymentMethod.CASH){
          // Update ledgers for drivers pay 10% of profits for the platform
          this.updateLedger(order.driver_id, order, order.trip_fare * -0.1);
        }
      }

      return await bill.save();

    }

    async getLedger(owner_id: string): Promise<LedgerDocument> {
      const ledger_exist = await this.ledgerModel.findOne({ owner_id: owner_id, closed: false },)
      if (ledger_exist ) {
        return ledger_exist;
      }

      return await new this.ledgerModel({
        owner_id: owner_id,
      }).save();
    }

    async closeLedger(owner_id: string): Promise<LedgerDocument>{
      const ledger = await this.getLedger(owner_id);

      ledger.closed = true;

      return await ledger.save();
    }

    async updateLedger(owner_id: string, order: Order, amount: number) {
      const ledger = await this.getLedger(owner_id);

      ledger.orders.push(order);
      ledger.total += amount;

      await ledger.save();
    }


}
