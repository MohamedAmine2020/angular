import {Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation} from '@angular/core';
import {MatDialog} from '@angular/material';
import {DataSource} from '@angular/cdk/collections';
import {Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {fuseAnimations} from '@fuse/animations';
import {ReceiptResolver} from '../receipt.resolver';
import {ReceiptService} from '../receipt.service';
import {Receipt} from '../receipt.model';
import {FileUtils, RouteService} from '../../../../core';

@Component({
    selector: 'receipt-list',
    templateUrl: './receipt-list.component.html',
    styleUrls: ['./receipt-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class ReceiptListComponent implements OnInit, OnDestroy {
    @ViewChild('dialogContent')
    dialogContent: TemplateRef<any>;

    receipts: any;
    // user: any;
    dataSource: FilesDataSource | null;
    displayedColumns = ['code', 'service', 'date', 'client', 'amount', 'buttons'];

    // Private
    private _unsubscribeAll: Subject<any>;

    constructor(
        private _receiptResolver: ReceiptResolver,
        private _receiptService: ReceiptService,
        public _matDialog: MatDialog,
        private _routeService: RouteService
    ) {
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    ngOnInit(): void {
        this.dataSource = new FilesDataSource(this._receiptResolver);
        this._receiptResolver.onReceiptsChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(receipts => {
                this.receipts = receipts;
            });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    downloadReceipt(receipt: Receipt): void {
        this._receiptService.downloadReceipt(receipt.id)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(data => {
                FileUtils.downloadFile(`${receipt.code}.pdf`, data);
            });
    }

    navigateToWorkerWorkDetails(workId: number): void {
        this._routeService.navigateToWorkerWorkDetails(workId);
    }

}

export class FilesDataSource extends DataSource<any> {

    constructor(private _invoiceResolver: ReceiptResolver) {
        super();
    }

    connect(): Observable<any[]> {
        return this._invoiceResolver.onReceiptsChanges;
    }

    disconnect(): void {
    }
}
