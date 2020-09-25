import {Component, Input, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {Subject} from 'rxjs';
import {fuseAnimations} from '../../../../../@fuse/animations';
import {WorkContract} from '../../../work/work-contract.model';
import {takeUntil} from 'rxjs/operators';
import {PaymentService} from '../../../work/payment/payment.service';
import {Payment} from '../../../work/payment/payment.model';

@Component({
    selector: 'worker-work-paid-info',
    templateUrl: './worker-work-paid-info.component.html',
    styleUrls: ['./worker-work-paid-info.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class WorkerWorkPaidInfoComponent implements OnInit, OnDestroy {


    @Input()
    contract: WorkContract;
    payment: Payment;

    private _unsubscribeAll: Subject<any>;

    constructor(private _paymentService: PaymentService) {
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        this._paymentService.get(this.contract.work.id, this.contract.worker.id)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(payment => this.payment = new Payment(payment));
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

}
