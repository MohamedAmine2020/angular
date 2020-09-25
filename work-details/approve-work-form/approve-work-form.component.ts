import {Component, Input, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {Subject} from 'rxjs';

import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {fuseAnimations} from '../../../../../@fuse/animations';
import {Work} from '../../../work/work.model';
import {WorkContract} from '../../../work/work-contract.model';
import {WorkService} from '../../../work/work.service';
import {WorkPaymentData} from '../../../work/work-payment-data.model';
import {AccountService, SpinnerService, MapsService, Address} from '../../../../core';
import {WorkerWorkDetailsService} from '../worker-work-details.service';
import {takeUntil} from 'rxjs/operators';
import {TranslateService} from '@ngx-translate/core';
import {SnackService} from '../../../components/snack/snack.service';
import {MatDialog} from '@angular/material';
import {WorkedHoursNumberChangedDialogComponent} from './worked-hours-number-changed-form-dialog/worked-hours-number-changed-dialog.component';
import {WorkerService} from "../../worker.service";
import {AddIdentityDocumentComponent} from "./add-identity-document/add-identity-document.component";
import {BankAccountComponent} from '../../../shared/bank-account/bank-account.component';
import { WorkerProfessionalInformation } from 'app/main/components/worker/worker-form/worker-professional-information-form/worker-professional-information.model';
import { postcodeValidator } from 'postcode-validator';
import {MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from '@angular/material/snack-bar';

@Component({
    selector: 'approve-work-form',
    templateUrl: './approve-work-form.component.html',
    styleUrls: ['./approve-work-form.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class ApproveWorkFormComponent implements OnInit, OnDestroy {
    form: FormGroup;
    @Input()
    work: Work;
    minutes: Array<any>;
    private _unsubscribeAll: Subject<any>;
    hasPostalCode = false;
    address: Address;
    professionalInfomation: WorkerProfessionalInformation;
    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top';

    constructor(private _formBuilder: FormBuilder,
                private _spinnerService: SpinnerService,
                private _accountService: AccountService,
                private _workService: WorkService,
                private _workerWorkDetailsService: WorkerWorkDetailsService,
                private _matDialog: MatDialog,
                private _workerService: WorkerService,
                private _mapsService: MapsService,
                private _snackBar: MatSnackBar

    ) {
        this._unsubscribeAll = new Subject();
    }

    private _contract: WorkContract;

    get contract(): WorkContract {
        return this._contract;
    }

    @Input()
    set contract(contract: WorkContract) {
        if (contract === null) {
            this._contract = new WorkContract({});
        } else {
            this._contract = new WorkContract(contract);
        }
        this.form = this.buildForm();
    }

    ngOnInit(): void {
        this.minutes = this.buildMinutes();
        this.getCurrentAddress();
    }

 
    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    submitPaymentData(): void {
        if (this.isWorkDurationChanges()) {
            this._matDialog.open(WorkedHoursNumberChangedDialogComponent, {
                panelClass: 'worked-hours-number-changed-dialog',
                data: {
                    action: 'edit'
                }
            }).afterClosed().subscribe(response => {
                if (!response.message) {
                    return;
                }

                this.submitPaymentData_(response.message);
            });
        } else {
            this.submitPaymentData_();
        }
    }

    getCurrentAddress(){
        this._workerService.getProfessionalInformation(this._contract.worker.id).subscribe((professionalInfomation) => {
            this.professionalInfomation = new WorkerProfessionalInformation(professionalInfomation);
            this.address = this.professionalInfomation.workZone.address;
            if(professionalInfomation.workZone.address.postalCode !==null){
                this.hasPostalCode = true;
            }
            else {
                this.hasPostalCode = false;
            }
        })
    }
   

    approve(): void {
        this.address.postalCode = this.form.getRawValue().postalCode;
             if(!postcodeValidator(this.address.postalCode,"CA")){
                this._snackBar.open('Votre code postal est invalide!!', 'X', {
                    duration: 10000,
                    horizontalPosition: this.horizontalPosition,
                    verticalPosition: this.verticalPosition,
                  });
               }
            else {
            this._mapsService.savePostalCode(this.address.id,this.address).subscribe((ok)=>{
                if(!ok){
                    return;
                }
              });
            this._workerService.hasIdentityDocument()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(
                (hasIdentityDocument) => {
                    if (hasIdentityDocument) {
                        this._accountService.fetch()
                        .subscribe(
                            (hasBankAccount)=> {
                                if(hasBankAccount) {
                                    this.submitPaymentData()
                                }
                                else {
                                    this._showAddBankAccountDocument();
                                }
                            },
                            ()=>{
            
                            }
                        );
                    } else {
                        this._showAddIdentityDocument();
                    }
                },
                () => {
                }
            );
        }
    }

    submitPaymentData_(message?: string): void {
        this._spinnerService.show();
        const formRawValue = this.form.getRawValue();
        const hours = formRawValue.workedHoursNumber;
        const minutes = formRawValue.workedMinutesNumber;
        const paymentData = new WorkPaymentData({
            workedHoursNumber: hours + minutes,
            workedHoursNumberChangeMessage: message
        });
        paymentData.workerId = this._contract.worker.id;
        this._workService.submitWorkDone(paymentData, this._contract.work.id)
            .subscribe(

                () => this.refreshPageData(),

                response => {
                    this._spinnerService.hide();
                    this._showAddBankAccountDocument();
                });
    }


    isWorkDurationChanges(): boolean {
        const formRawValue = this.form.getRawValue();
        const hours = formRawValue.workedHoursNumber;
        const minutes = formRawValue.workedMinutesNumber;
        const estimatedHoursNumber = Math.trunc(this._contract.applyData.hoursNumber);
        const estimatedMinutesNumber = this._contract.applyData.hoursNumber - estimatedHoursNumber;
        return hours !== estimatedHoursNumber || minutes !== estimatedMinutesNumber;
    }

    refreshPageData(): void {
        this._workerWorkDetailsService
            .refresh()
            .then(() => this._spinnerService.hide());
    }

   /* showErrorMessage(errorKey): void {
        this._translateService
            .get(`worker-work-details.messages.${errorKey}`)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(message => this._snackService.error(message));
    }*/

    private _showAddIdentityDocument(): void {
        this._matDialog.open(AddIdentityDocumentComponent, {
            panelClass: 'add-identity-document',
            data: {
                action: 'edit'
            }
        }).afterClosed().subscribe(response => {
            if (!response) {
                return;
            }
            this.submitPaymentData();
        });
    }
    private _showAddBankAccountDocument(): void {

        this._matDialog.open(BankAccountComponent, {
            panelClass: 'add-bank-account-document',
            data: {
                action: 'add'
            }
        }).afterClosed().subscribe(response => {
            if(!response){
                return;
            }
            this.submitPaymentData_();

        });
        }


    private buildForm(): FormGroup {
        const hoursNumber = Math.trunc(this._contract.applyData.hoursNumber);
        const minutes = this._contract.applyData.hoursNumber - hoursNumber;
        return this._formBuilder.group({
            postalCode: [""],
            workedHoursNumber: [hoursNumber, [Validators.required, Validators.min(1)]],
            workedMinutesNumber: [minutes, [Validators.required]]
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
