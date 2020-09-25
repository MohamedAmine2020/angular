import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {
    MatAutocompleteModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatRippleModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatTabsModule,
    MatToolbarModule,
} from '@angular/material';

import {FuseSharedModule} from '@fuse/shared.module';


import {FuseSidebarModule} from '@fuse/components';
import {NgxMaskModule} from 'ngx-mask';
import {WorkerFormModule} from '../../components/worker/worker-form/worker-form.module';
import {ImageModule} from '../../components/image/image.module';
import {WorkerServicesModule} from '../../components/worker/worker-services/worker-services.module';
import {WorkerDashboardComponent} from './worker-dashboard.component';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {WorkerDashboardResolver} from './worker-dashboard.resolver';
import {UserRouteAccessService, WijaaCoreModule, WORKER} from '../../../core';
import {PotentialWorkListItemComponent} from './potential-work-list/potential-work-list-item/potential-work-list-item.component';
import {PotentialWorkListComponent} from './potential-work-list/potential-work-list.component';
import {ConfirmDialogComponent} from '../../components/confirm-dialog/confirm-dialog.component';
import {ConfirmDialogModule} from '../../components/confirm-dialog/confirm-dialog.module';
import {WorkListComponent} from './work-list/work-list.component';
import {WorkListItemComponent} from './work-list/work-list-item/work-list-item.component';
import {WorkStatusModule} from '../../components/work/work-status/work-status.module';

const routes = [
    {
        path: 'dashboard/:id',
        component: WorkerDashboardComponent,
        resolve: {
            identity: WorkerDashboardResolver
        },
        data: {
            authorities: [WORKER],
            pageTitle: 'worker-dashboard.page.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

@NgModule({
    declarations: [
        WorkerDashboardComponent,
        PotentialWorkListItemComponent,
        PotentialWorkListComponent,
        WorkListComponent,
        WorkListItemComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        MatButtonModule,
        MatFormFieldModule,
        MatCheckboxModule,
        MatIconModule,
        MatInputModule,
        MatToolbarModule,
        MatDialogModule,
        MatDatepickerModule,
        MatSelectModule,
        MatAutocompleteModule,
        MatRippleModule,
        MatTabsModule,
        MatExpansionModule,
        MatSlideToggleModule,
        NgxMaskModule,
        MatDividerModule,
        NgxChartsModule,
        ConfirmDialogModule,
        FuseSharedModule,
        FuseSidebarModule,
        WorkerServicesModule,
        WorkerFormModule,
        WijaaCoreModule,
        ImageModule,
        WorkStatusModule
    ],
    providers: [
        WorkerDashboardResolver
    ],
    entryComponents: [ConfirmDialogComponent]
})
export class WorkerDashboardModule {
}
