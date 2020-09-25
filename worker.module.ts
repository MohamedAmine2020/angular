import {NgModule} from '@angular/core';
import {CompleteProfileModule} from './complete-profile/complete-profile.module';
import {WorkerProfileModule} from './profile/worker-profile.module';
import {WorkerDashboardModule} from './dashboard/worker-dashboard.module';
import {WorkerPotentialsWorksModule} from './potential-works/worker-potentials-works.module';
import {WorkerWorkDetailsModule} from './work-details/worker-work-details.module';
import {ReceiptModule} from './receipt/receipt.module';
import { CompleteProfileBeforeLoginModule } from './complete-profile-before-login/complete-profile.module';


@NgModule({
    imports: [
        // Profile,
        CompleteProfileModule,
        CompleteProfileBeforeLoginModule,
        WorkerProfileModule,

        // Dashboard
        WorkerDashboardModule,

        // Works
        WorkerPotentialsWorksModule,
        WorkerWorkDetailsModule,

        // Receipt
        ReceiptModule,


    ]
})
export class WorkerModule {
}
