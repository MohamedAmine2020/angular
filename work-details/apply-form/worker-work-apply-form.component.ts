import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {fuseAnimations} from '../../../../../@fuse/animations';
import {Work} from '../../../work/work.model';
import {WorkContract} from '../../../work/work-contract.model';
import {WorkerWorkDetailsService} from '../worker-work-details.service';
import {AccountService, SpinnerService} from '../../../../core';

@Component({
    selector: 'worker-work-apply-form',
    templateUrl: './worker-work-apply-form.component.html',
    styleUrls: ['./worker-worker-apply-form.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class WorkerWorkApplyFormComponent implements OnInit, OnDestroy {

    work: Work = new Work({});
    currentWorkerContract: WorkContract = new WorkContract({});
    form: FormGroup;
    minutes: Array<any>;

    private _unsubscribeAll: Subject<any>;

    constructor(private _applyToWorkService: WorkerWorkDetailsService,
                private _formBuilder: FormBuilder,
                private _spinnerService: SpinnerService,
                private _accountService: AccountService
    ) {
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        this.initWork();
        this.minutes = this.buildMinutes();
        this.initWorkContracts();
        this.form = this.buildForm();
        this.patchDefautlValue();
       
    }

    patchDefautlValue(){
        if(this.work.estimatedHour !==null){
            this.form.get('hoursNumber').patchValue(this.work.estimatedHour);
        }

        else {
            this.form.get('hoursNumber').patchValue(2);
        }
        
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    accept(): void {
        this._spinnerService.show();
        const minutes = this.form.get('minutesNumber').value;
        const hours = this.form.get('hoursNumber').value;
        const total = Number(hours) + minutes;
        this._applyToWorkService.accept(Number(total))
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this._applyToWorkService.refresh()
                    .then(() => this._spinnerService.hide())
                    .catch(() => this._spinnerService.hide());
            }, () => {
                this._spinnerService.hide();
            });

    }

    showApplyForm(): boolean {
        return (this.work.isAccepted || this.work.isCreated) && this.currentWorkerContract.isCreated;
    }

    showApplyInfoMessage(): boolean {
        return (this.work.isAccepted || this.work.isCreated) && this.currentWorkerContract.isAccepted;
    }

    private initWork(): void {
        this._applyToWorkService.onWorkChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((work: Work) => {
                this.work = new Work(work);
            });
    }

    private buildForm(): FormGroup {
        return this._formBuilder.group({
            hoursNumber: ['', [Validators.required, Validators.min(1)]],
            minutesNumber: [0, [Validators.required]]
        });
    }

    private initWorkContracts(): void {
        this._applyToWorkService.onWorkContractsChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(worksContracts => {
                const workContract = worksContracts
                    .find(contract => contract.worker.id === this._accountService.getIdentity().id);
                if (!workContract) {
                    return;
                }
                this.currentWorkerContract = new WorkContract(workContract);
            });
    }

    private buildMinutes(): Array<any> {
        return [
            {label: '00 minutes', value: 0},
            {label: '15 minutes', value: 0.25},
            {label: '30 minutes', value: 0.5},
            {label: '45 minutes', value: 0.75}];
    }

}
