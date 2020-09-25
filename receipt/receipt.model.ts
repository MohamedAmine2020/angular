import {FuseUtils} from '@fuse/utils';
import {Account} from '../../../core';

export class Receipt {
    id: number;
    workId: number;
    code: string;
    service: string;
    date: string;
    client: Account;
    amount: string;

    constructor(receipt) {
        {
            this.id = receipt.id || FuseUtils.generateGUID();
            this.workId = receipt.workId;
            this.code = receipt.code || '';
            this.service = receipt.service || '';
            this.date = receipt.date || '';
            this.client = receipt.client || new Account({});
            this.amount = receipt.amount || '';
        }
    }
}
