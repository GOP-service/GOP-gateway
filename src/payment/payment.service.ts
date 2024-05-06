import { Injectable } from '@nestjs/common';
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
import { PromotionType } from 'src/utils/enums';
import { UpdatePromotionDto } from './dto/update-promotion.dto';

@Injectable()
export class PaymentService {
  constructor(
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

  createPromotion(dto: CreatePromotionDto) {
    const promo = new this.promotionModdel(dto);
    return promo.save();
  }

  async updatePromotion(dto: UpdatePromotionDto) {
    const promotion = await this.promotionModdel.findByIdAndUpdate(dto.id, dto, { new: true })
    if(promotion)
      return promotion
    throw new Error('Update state failed')
  }

  async validateAndApplyPromotion(id: string, order_total: number, list_promotion_id: string[]): Promise<number>{
    let discount_value = 0;
    const promotions = list_promotion_id.map(async (promo_id) => {
      const promo = await this.promotionModdel.findById(promo_id);
      if (promo) {
        const currDate = new Date();
        if (currDate >= promo.start_time && currDate <= promo.end_time && order_total >= promo.flat_off_discount.min_spend && !promo.unavailable_users.includes(id) && promo.unavailable_users.length < promo.limit) {
          promo.unavailable_users.push(id);
          await promo.save(); 
          discount_value += promo.flat_off_discount.discount_value
        }
      }
    });
    
    await Promise.all(promotions);
    return discount_value;
  }
}
