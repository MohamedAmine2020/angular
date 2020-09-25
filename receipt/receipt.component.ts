import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {Subject} from 'rxjs';

import {fuseAnimations} from '@fuse/animations';
import {FuseSidebarService} from '@fuse/components/sidebar/sidebar.service';
import {FuseConfigService} from '../../../../@fuse/services/config.service';
import {ReceiptResolver} from './receipt.resolver';

@Component({
    selector: 'receipt',
    templateUrl: './receipt.component.html',
    styleUrls: ['./receipt.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class ReceiptComponent implements OnInit, OnDestroy {

    private _unsubscribeAll: Subject<any>;

    constructor(
        private _invoiceResolver: ReceiptResolver,
        private _fuseSidebarService: FuseSidebarService,
        private _fuseConfigService: FuseConfigService
    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
        this.configureLayout();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    ngOnInit(): void {
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    private configureLayout(): void {
        this._fuseConfigService.config = {
            layout: {
                navbar: {
                    hidden: false,
                    position: 'left'
                },
                toolbar: {
                    hidden: false,
                    position: 'above-fixed'
                },
                footer: {
                    hidden: false,
                },
                sidepanel: {
                    hidden: true
                }
            }
        };
    }
}
