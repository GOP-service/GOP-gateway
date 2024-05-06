import { Injectable } from "@nestjs/common";
import * as qs from 'qs';
import * as crypto from 'crypto';

@Injectable()
export class VnpayService {
    constructor() {}

    async createPaymentUrl(order_id: string, amount: number, customer_id: string, customer_ip: string) {
        const datenow = new Date().getTime() + 7 *60*60*100;
        
        var vnp_Url = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
        const vnp_Returnurl = 'http://localhost:8080/api/v1/order/vnpay-return';
        
        
        const vnp_Version = '2.1.0';
        const vnp_Command = 'pay';
        const vnp_TmnCode = '0NDLY2ZY';
        const vnp_Amount = amount ;
        const vnp_BankCode = '';
        const vnp_SecureHash = 'TEYN1G2PDE862RJMRYIC1A10PRLYA0BO';
        
        const vnp_CreateDate = new Date(datenow).toISOString().replace(/[-T:\.Z]/g, '') 
        const vnp_CurrCode = 'VND';
        const vnp_Locale = 'vn';
        const vnp_OrderInfo = `pay_${order_id}`.toString();
        const vnp_OrderType = `other`;
        
        const vnp_ExpireDate = new Date(datenow+ 100*60*10 ).toISOString().replace(/[-T:\.Z]/g, '');//! 10 phút
        const vnp_TxnRef = order_id;
        const vnp_IpAddr = customer_ip;   

        
        var data = {
            vnp_Version: vnp_Version,
            vnp_Command: vnp_Command,
            vnp_TmnCode: vnp_TmnCode,
            vnp_Amount: vnp_Amount,
            vnp_BankCode: vnp_BankCode,
            vnp_CreateDate: vnp_CreateDate,
            vnp_CurrCode: vnp_CurrCode,
            vnp_Locale: vnp_Locale,
            vnp_OrderInfo: vnp_OrderInfo,
            vnp_OrderType: vnp_OrderType,
            vnp_Returnurl: vnp_Returnurl,
            vnp_TxnRef: vnp_TxnRef,
            vnp_IpAddr: vnp_IpAddr,
            vnp_ExpireDate: vnp_ExpireDate
        };

        
        const signData = qs.stringify(data, { encode: false });
        const hmac = crypto.createHmac('sha512', 'TEYN1G2PDE862RJMRYIC1A10PRLYA0BO');
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
        data['vnp_SecureHash'] = signed;

        vnp_Url += '?' + qs.stringify(data, { encode: false });

        return vnp_Url;
    }
}