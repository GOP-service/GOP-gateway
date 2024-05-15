import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBillDto } from './dto/create-bill.dto';
import { UpdateBillDto } from './dto/update-bill.dto';
import * as crypto from 'crypto';
import * as qs from 'qs';
import { format } from 'date-fns';
import { error, log } from 'console';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { Promotion, PromotionDocument } from './entities/promotion.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BillStatus, OrderType, PaymentMethod, PromotionDiscountType, PromotionScopeType } from 'src/utils/enums';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { Bill, BillDocument } from './entities/bill.schema';
import { Ledger, LedgerDocument } from './entities/ledger.schema';
import { OrderDetailsType } from 'src/order/entities/order.schema';
import { DeliveryOrder } from 'src/order/entities/delivery_order.schema';
import { TransportOrder } from 'src/order/entities/transport_order.schema';
import { Order, OrderDetails } from 'src/order/entities/order.schema';
import { ApplyPromotionDto } from './dto/apply-promotion.dto';


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
      vnp_Params['vnp_Amount'] = amount*100;
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

  async getAllPromotion():Promise<PromotionDocument[]>{
    const promo = await this.promotionModdel.find();
    return promo;
  }

  async createPromotion(dto: CreatePromotionDto) {
    const promo = await new this.promotionModdel(dto);
    return promo.save();
  }

  async deletePromotion(promotion_id: string) {
    const promo = await this.promotionModdel.findByIdAndDelete(promotion_id)
    if (!promo) {
      throw new NotFoundException("Promotion not found!");
    }
    return promo;
  }

  async updatePromotion(dto: UpdatePromotionDto) {
    const promotion = await this.promotionModdel.findByIdAndUpdate(dto.id, dto, { new: true })
    if(promotion)
      return promotion
    throw new Error('Update state failed')
  }

  isValidPromotion(customer_id: string, promo: Promotion, promoDto: ApplyPromotionDto){
    const currDate = new Date();
    return promo &&
      promo.conditions.start_time <= currDate &&
      promo.conditions.end_time >= currDate &&
      promo.quotas.limit > promo.unavailable_users.length &&
      promo.unavailable_users.filter(id => id === customer_id).length < promo.quotas.total_count_per_count && 
      promoDto.subtotal >= promo.conditions.minBasketAmount;
  }

  async validateAndApplyPromotion(customer_id: string, promoDto: ApplyPromotionDto): Promise<number> {
    let total_discount_value = 0;
    for (const promo_id of promoDto.list_promotion_id) {
      const promo = await this.promotionModdel.findById(promo_id);
      if (this.isValidPromotion(customer_id, promo, promoDto)) {
        promo.unavailable_users.push(customer_id)
        await promo.save();
        switch (promo.discount.type) {
          case PromotionDiscountType.DELIVERY:
            total_discount_value += (promoDto.delivery_fare - promo.discount.value) > 0 ? promo.discount.value : promoDto.delivery_fare;
            break;
          case PromotionDiscountType.PERCENTAGE: 
            switch(promo.discount.scope.type){
              case PromotionScopeType.ORDER: 
                const discount_value = promoDto.subtotal * (promo.discount.value / 100)
                if(discount_value <= promo.discount.cap) {
                  total_discount_value += discount_value
                } else total_discount_value += promo.discount.cap
                break;
              case PromotionScopeType.CATEGORY: 
                break;
              case PromotionScopeType.ITEMS:
                break;
            }
            break;
          case PromotionDiscountType.TRANSPORT:
            const discount_value = promoDto.subtotal - promo.discount.value;
            total_discount_value += discount_value > 0 ? promo.discount.value : promoDto.subtotal
            break;
          case PromotionDiscountType.NET:
            switch(promo.discount.scope.type) {
              case PromotionScopeType.ORDER:
                const discount_value = promoDto.subtotal - promo.discount.value;
                total_discount_value += discount_value > 0 ? promo.discount.value : promoDto.subtotal 
                break;
              case PromotionScopeType.CATEGORY: 
                break;
              case PromotionScopeType.ITEMS:
                break;
            }
            break;
          default: 
            break
        }
      }
    }
    return -total_discount_value;
  }

    async createBill(createBillDto: CreateBillDto) {
      const new_bill = new this.billModel({
        order_id: createBillDto.order._id,
        payment_method: createBillDto.payment_method,
      });

      //todo check promotion các kiểu đà điểu
      let discount = 0;

      //todo tính tiền từ promotion
      if (createBillDto.order instanceof DeliveryOrder) {
        new_bill.sub_total = createBillDto.order.delivery_fare + createBillDto.order.order_cost;
      } else {
        new_bill.sub_total = createBillDto.order.trip_fare;        
      }

      new_bill.discount = discount;
      new_bill.total = new_bill.sub_total - discount + new_bill.platform_fee;

      return await new_bill.save();
    }

    async getBill(id: string): Promise<BillDocument> {
      return await this.billModel.findById(id).exec();
    }

    async updateBillComplete(order : OrderDetailsType) {
      const bill = await this.billModel.findOne(order.bill).exec();

      bill.status = BillStatus.COMPLETED;

      if (order instanceof DeliveryOrder) {
        if (bill.payment_method === PaymentMethod.VNPAY) {

          // cập nhật ledger cho restaurant và driver với 90% lợi nhuận
          this.updateLedger(order.restaurant._id, order, order.order_cost * 0.9);
          this.updateLedger(order.driver._id, order, order .delivery_fare * 0.9);
        } else if (bill.payment_method === PaymentMethod.CASH){
          // cập nhật ledgers cho restaurant và drivers trả 10% lợi nhận cho nền tảng
          this.updateLedger(order.restaurant._id, order, order.order_cost * -0.1);
          this.updateLedger(order.driver._id, order, order.delivery_fare * -0.1);
        }
      } else if (order instanceof TransportOrder){
        if (bill.payment_method === PaymentMethod.VNPAY) {
          // cập nhật ledgers cho drivers với 90% lợi nhuận
          this.updateLedger(order.driver._id, order, order.trip_fare * 0.9);
        } else if (bill.payment_method === PaymentMethod.CASH){
          // cập nhật ledgers cho drivers trả 10% lợi nhuận cho nền tảng
          this.updateLedger(order.driver._id, order, order.trip_fare * -0.1);
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
