import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {MatButtonModule, MatDividerModule, MatFormFieldModule, MatIconModule, MatSlideToggleModule, MatTabsModule} from '@angular/material';
import {FuseSharedModule} from '@fuse/shared.module';
import {WijaaCoreModule} from '../../../core';
import {StarRatingModule} from 'angular-star-rating';
import {WorkerProfileService} from './Worker-profile.service';
import {WorkerProfileComponent} from './worker-profile.component';
import {WorkerServicesModule} from '../../components/worker/worker-services/worker-services.module';
import {WorkerProfileEditComponent} from './edit/worker-profile-edit.component';
import {WorkerFormModule} from '../../components/worker/worker-form/worker-form.module';
import {WorkerProfileWorkPreferenceComponent} from './work-preference/worker-profile-work-preference.component';
import {WorkerProfileAboutMeComponent} from './about-me/worker-profile-about-me.component';
import {WorkerProfileReviewsComponent} from './evaluation/worker-profile-reviews.component';
import {WorkerProfilePersonalInformationComponent} from './personal-information/worker-profile-personal-information.component';
import {ReviewsSummaryModule} from 'app/main/components/work/work-review/reviews-summary/reviews-summary.module';
import {DisableAccountComponent} from './disable-account/disable-account.component';

const routes = [
    {
        path: 'profile/:workerId',
        component: WorkerProfileComponent,
        resolve: {
            profile: WorkerProfileService
        }
    },
    {
        path: 'profile/edit/:workerId',
        component: WorkerProfileEditComponent,
        resolve: {
            profile: WorkerProfileService
        }
    }
];

@NgModule({
    declarations: [
        WorkerProfileComponent,
        WorkerProfileWorkPreferenceComponent,
        WorkerProfileAboutMeComponent,
        WorkerProfileReviewsComponent,
        WorkerProfilePersonalInformationComponent,
        WorkerProfileEditComponent,
        DisableAccountComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        StarRatingModule,
        MatButtonModule,
        MatDividerModule,
        MatIconModule,
        MatTabsModule,
        MatFormFieldModule,
        FuseSharedModule,
        WorkerServicesModule,
        WijaaCoreModule,
        WorkerFormModule,
        WorkerServicesModule,
        ReviewsSummaryModule,
        MatSlideToggleModule
    ],
    providers: [
        WorkerProfileService
    ]
})
export class WorkerProfileModule {
}
