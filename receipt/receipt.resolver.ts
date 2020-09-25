import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {BehaviorSubject, Observable} from 'rxjs';
import {Receipt} from './receipt.model';
import {ReceiptService} from './receipt.service';


@Injectable()
export class ReceiptResolver implements Resolve<any> {

    onReceiptsChanges: BehaviorSubject<any>;
    receipts: Receipt[];

    searchText: string;

    constructor(private _httpClient: HttpClient, private _receiptService: ReceiptService) {
        // Set the defaults
        this.onReceiptsChanges = new BehaviorSubject([]);
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        return new Promise((resolve, reject) => {

            Promise.all([
                this.getReceipts(),
            ]).then(() => {
                    resolve();
                },
                reject
            );
        });
    }

    getReceipts(): Promise<any> {
        return new Promise((resolve) => {
                this._receiptService.getWorkerReceipts().subscribe(receipts => {
                    this.receipts = receipts;
                    this.onReceiptsChanges.next(this.receipts);
                    resolve(this.receipts);
                });
            }
        );
    }

}
