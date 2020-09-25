import {NgModule} from '@angular/core';
import {
    MatButtonModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatToolbarModule,
    MatTooltipModule
} from '@angular/material';
import {UserRouteAccessService, WijaaCoreModule, WORKER} from '../../../core';
import {NgxMaskModule} from 'ngx-mask';
import {FuseSharedModule} from '../../../../@fuse/shared.module';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {WorkerWorkDetailsComponent} from './worker-work-details.component';
import {RouterModule} from '@angular/router';
import {WorkerWorkDetailsService} from './worker-work-details.service';
import {WorkDetailsModule} from '../../components/work/work-details/work-details.module';
import {StarRatingModule} from 'angular-star-rating';
import {WorkWorkerListModule} from '../../components/work/work-worker-list/work-worker-list.module';
import {WorkerWorkApplyFormComponent} from './apply-form/worker-work-apply-form.component';
import {WorkerWorkPaidInfoComponent} from './work-paid-info/worker-work-paid-info.component';
import {SnackModule} from '../../components/snack/snack.module';
import {SnackService} from '../../components/snack/snack.service';
import {SnackbarComponent} from '../../components/snack/snack.component';
import {ApproveWorkFormComponent} from './approve-work-form/approve-work-form.component';
import {WorkStatusStepperModule} from '../../components/work/work-status-stepper/work-status-stepper.module';
import {WorkOfferedToOtherWorkerComponent} from './work-offered-to-other-worker/work-offered-to-other-worker.component';
import {WaitClientApproveWorkDoneComponent} from './wait-client-approve-work-done/wait-client-approve-work-done.component';
import {WorkedHoursNumberChangedDialogComponent} from './approve-work-form/worked-hours-number-changed-form-dialog/worked-hours-number-changed-dialog.component';
import {WorkerFormModule} from "../../components/worker/worker-form/worker-form.module";
import {AddIdentityDocumentComponent} from "./approve-work-form/add-identity-document/add-identity-document.component";
import {MatTabsModule} from "@angular/material/tabs";
import {WorkSelectedWorkerModule} from "../../components/work/work-selected-worker/work-selected-worker.module";
import {MatDialogModule} from "@angular/material/dialog";
import {AccountModule} from "../../shared/account/account.module";
import {BankAccountEditComponent} from "../../components/bank-account-edit/bank-account-edit.component";
import {BankAccountEditModule} from "../../components/bank-account-edit/bank-account-edit.module";
import {BankAccountComponent} from '../../shared/bank-account/bank-account.component';

const routes = [
    {
        path: 'work-details/:workId',
        component: WorkerWorkDetailsComponent,
        resolve: {
            identity: WorkerWorkDetailsService
        },
        data: {
            authorities: [WORKER],
            pageTitle: 'worker-work-details.page.title'
        },
        canActivate: [UserRouteAccessService]
    }
];


@NgModule({
    imports: [
        RouterModule.forChild(routes),
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatToolbarModule,
        MatExpansionModule,
        StarRatingModule,
        NgxMaskModule,
        WijaaCoreModule,
        FuseSharedModule,
        MatSnackBarModule,
        WorkDetailsModule,
        WorkWorkerListModule,
        SnackModule,
        MatSelectModule,
        WorkStatusStepperModule,
        MatTooltipModule,
        WorkerFormModule,
        MatTabsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatToolbarModule,
        MatExpansionModule,
        StarRatingModule,
        NgxMaskModule,
        WijaaCoreModule,
        FuseSharedModule,
        MatSnackBarModule,
        WorkDetailsModule,
        WorkWorkerListModule,
        WorkStatusStepperModule,
        WorkSelectedWorkerModule,
        SnackModule,
        MatSelectModule,
        MatDialogModule,
        MatTooltipModule,
        AccountModule,
        BankAccountEditModule
    ],
    providers: [
        WorkerWorkDetailsService,
        SnackService
    ],
    declarations: [
        WorkerWorkDetailsComponent,
        WorkerWorkApplyFormComponent,
        WorkerWorkPaidInfoComponent,
        ApproveWorkFormComponent,
        WorkOfferedToOtherWorkerComponent,
        WaitClientApproveWorkDoneComponent,
        WorkedHoursNumberChangedDialogComponent,
        AddIdentityDocumentComponent,
        BankAccountComponent
    

    ],
    entryComponents: [
        SnackbarComponent,
        WorkedHoursNumberChangedDialogComponent,
        AddIdentityDocumentComponent,
        BankAccountEditComponent,
        BankAccountComponent
    
    ]
})
export class WorkerWorkDetailsModule {
}
