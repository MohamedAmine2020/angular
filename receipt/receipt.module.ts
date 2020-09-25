import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule, MatPaginatorModule,
    MatRippleModule,
    MatTableModule,
    MatToolbarModule
} from '@angular/material';

import {FuseSharedModule} from '@fuse/shared.module';
import {FuseSidebarModule} from '@fuse/components';
import {ConfirmDialogComponent} from '../../components/confirm-dialog/confirm-dialog.component';
import {ReceiptComponent} from './receipt.component';
import {ReceiptListComponent} from './receipt-list/receipt-list.component';
import {ReceiptResolver} from './receipt.resolver';
import {WijaaCoreModule} from "../../../core";

const routes: Routes = [
    {
        path: 'receipt',
        component: ReceiptComponent,
        data: {
            pageTitle: 'receipt.page.title'
        },
        resolve: {
            contacts: ReceiptResolver
        }
    }
];

@NgModule({
    declarations: [
        ReceiptComponent,
        ReceiptListComponent
    ],
    imports: [
        RouterModule.forChild(routes),

        MatButtonModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatRippleModule,
        MatTableModule,
        MatToolbarModule,
        FuseSharedModule,
        FuseSidebarModule,
        MatPaginatorModule,
        WijaaCoreModule
    ],
    providers: [
        ReceiptResolver
    ],
    entryComponents: [
        ConfirmDialogComponent
    ]
})
export class ReceiptModule {
}
