import {Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Receipt} from './receipt.model';

@Injectable({providedIn: 'root'})
export class ReceiptService {

    private readonly RECEIPT_API_URL: string = `${environment.SERVER_API_URL}api/receipts`;

    constructor(private _http: HttpClient) {
    }

    getWorkerReceipts(): Observable<Array<Receipt>> {
        return this._http.get<Array<Receipt>>(this.RECEIPT_API_URL);
    }

    getReceipt(workId: number, workerId: number): Observable<Receipt> {
        return this._http.get<Receipt>(this.RECEIPT_API_URL + `/${workId}/${workerId}`);
    }

    downloadReceipt(receiptId: number): any {
        const httpOptions = {
            responseType: 'blob' as 'json',
        };
        return this._http.get(this.RECEIPT_API_URL + `/${receiptId}/pdf`, httpOptions);
    }

}
