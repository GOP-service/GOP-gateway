import { Injectable } from '@nestjs/common';
import { CustomerService } from 'src/customer/customer.service';
import { OrderService } from 'src/order/order.service';

@Injectable()
export class AdminService {
    constructor(
        private readonly customerService: CustomerService,
   

    ){}


    async findAllCustomer() {
        return await this.customerService.findAllCustomer();
    }

    async changeAccVerifyStatus(verified: boolean, _id: string) {
        return await this.customerService.changeVerifyStatus(verified, _id)
    }

    // async findAllByCusId()
}
