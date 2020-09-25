import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';

import {
    MatAutocompleteModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatRippleModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatToolbarModule,
    MatButtonToggleModule,
    MatRadioModule,
    MatStepperModule,
} from '@angular/material';

import {FuseSharedModule} from '@fuse/shared.module';


import {FuseSidebarModule} from '@fuse/components';
import { CompleteProfileBeforeLoginComponent} from './complete-profile.component';
import {ProfileImageCropperDialogComponent} from '../../components/image/profile-image-croque/profile-image-cropper-dialog.component';
import {NgxMaskModule} from 'ngx-mask';
import {WorkerFormModule} from '../../components/worker/worker-form/worker-form.module';
import {ImageModule} from '../../components/image/image.module';
import {WorkerServicesModule} from '../../components/worker/worker-services/worker-services.module';
import { WORKER} from '../../../core';
import { CompleteProfileBeforeLoginResolver} from './complete-profile.resolver';
import {TranslateModule} from '@ngx-translate/core';
import { FooterModule } from 'app/main/shared/footer/footer.module';
import { HeaderModule } from 'app/main/shared/header/header.module';

const routes = [
    {
        path: 'travaillez-avec-wijaa',
        component: CompleteProfileBeforeLoginComponent ,
        data: {
            authorities: [WORKER],
            pageTitle: 'worker-complete-profile.title'
        },
        resolve: {
            data: CompleteProfileBeforeLoginResolver
        }
    }
];

@NgModule({
    declarations: [
        CompleteProfileBeforeLoginComponent
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
        CompleteProfileBeforeLoginResolver
    ],
    entryComponents: [
        ProfileImageCropperDialogComponent
    ]
})
export class CompleteProfileBeforeLoginModule {
}
