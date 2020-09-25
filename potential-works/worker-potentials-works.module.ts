import {NgModule} from '@angular/core';
import {
    MatAutocompleteModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatRippleModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatToolbarModule
} from '@angular/material';
import {UserRouteAccessService, WijaaCoreModule, WORKER} from '../../../core';
import {NgxMaskModule} from 'ngx-mask';
import {MaterialFileInputModule} from 'ngx-material-file-input';
import {FuseSharedModule} from '../../../../@fuse/shared.module';
import {WorkerPotentialsWorksComponent} from './worker-potentials-works.component';
import {RouterModule} from '@angular/router';
import {FuseSidebarModule} from '../../../../@fuse/components';
import {WorkerPotentialsWorksService} from './worker-potentials-works.service';
import {MomentModule} from 'ngx-moment';
import 'moment/locale/fr';
import {WorkBoxModule} from '../../components/work/work-box/work-box.module';


const routes = [
    {
        path: 'potential-works',
        component: WorkerPotentialsWorksComponent,
        resolve: {
            data: WorkerPotentialsWorksService
        },
        data: {
            authorities: [WORKER]
        },
        canActivate: [UserRouteAccessService]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        MatButtonModule,
        MatFormFieldModule,
        MatSlideToggleModule,
        MatCheckboxModule,
        MatIconModule,
        MatInputModule,
        MatToolbarModule,
        MatDialogModule,
        MatDatepickerModule,
        MatSelectModule,
        MatAutocompleteModule,
        MatRippleModule,
        MatExpansionModule,
        NgxMaskModule,
        MaterialFileInputModule,
        WijaaCoreModule,
        FuseSharedModule,
        FuseSidebarModule,
        MomentModule,
        WorkBoxModule
    ],
    providers: [
        WorkerPotentialsWorksService
    ],
    declarations: [WorkerPotentialsWorksComponent],
    exports: [],
    entryComponents: []
})
export class WorkerPotentialsWorksModule {
}
