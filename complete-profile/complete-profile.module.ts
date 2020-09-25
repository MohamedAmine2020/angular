import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

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
    MatToolbarModule,
    MatButtonToggleModule,
    MatRadioModule,
    MatStepperModule
} from '@angular/material';

import {FuseSharedModule} from '@fuse/shared.module';


import {FuseSidebarModule} from '@fuse/components';
import {CompleteProfileComponent} from './complete-profile.component';
import {ProfileImageCropperDialogComponent} from '../../components/image/profile-image-croque/profile-image-cropper-dialog.component';
import {NgxMaskModule} from 'ngx-mask';
import {WorkerFormModule} from '../../components/worker/worker-form/worker-form.module';
import {ImageModule} from '../../components/image/image.module';
import {WorkerServicesModule} from '../../components/worker/worker-services/worker-services.module';
import {UserRouteAccessService, WORKER} from '../../../core';
import {CompleteProfileResolver} from './complete-profile.resolver';
import {TranslateModule} from '@ngx-translate/core';
import { FooterModule } from 'app/main/shared/footer/footer.module';
import { HeaderModule } from 'app/main/shared/header/header.module';

const routes = [
    {
        path: 'complete-profile',
        component: CompleteProfileComponent,
        data: {
            authorities: [WORKER],
            pageTitle: 'worker-complete-profile.title'
        },
        resolve: {
            data: CompleteProfileResolver
        }
    }
];

@NgModule({
    declarations: [
        CompleteProfileComponent
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
        FooterModule,
        HeaderModule,
        MatExpansionModule,
        MatSlideToggleModule,
        NgxMaskModule,
        FuseSharedModule,
        FuseSidebarModule,
        WorkerServicesModule,
        WorkerFormModule,
        ImageModule,
        TranslateModule,
        MatButtonToggleModule,
        MatRadioModule,
        MatStepperModule
    ],
    providers: [
        CompleteProfileResolver
    ],
    entryComponents: [
        ProfileImageCropperDialogComponent
    ]
})
export class CompleteProfileModule {
}
