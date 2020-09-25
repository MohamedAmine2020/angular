import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {BehaviorSubject, Observable} from 'rxjs';
import {WorkService} from '../../work/work.service';
import {Work} from '../../work/work.model';
import {WorkContract} from '../../work/work-contract.model';
import {Account, AccountService} from '../../../core';

@Injectable()
export class WorkerWorkDetailsService implements Resolve<any> {

    workId: number;
    onWorkChanged: BehaviorSubject<Work>;
    onIdentityChanged: BehaviorSubject<Account>;
    onWorkContractsChanged: BehaviorSubject<Array<WorkContract>>;
    private _identity: Account;

    constructor(private _workService: WorkService,
                private _accountService: AccountService) {
        this.onWorkChanged = new BehaviorSubject(new Work({}));
        this.onWorkContractsChanged = new BehaviorSubject([]);
        this.onIdentityChanged = new BehaviorSubject(new Account({}));
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        this.workId = route.params.workId;
        return this.load();
    }

    getWork(): Promise<Work> {
        return new Promise((resolve, reject) => {
            this._workService.get(Number(this.workId))
                .subscribe((response: any) => {
                    this.onWorkChanged.next(response);
                    resolve(response);
                }, reject);
        });
    }

    getIdentity(): Promise<Account> {
        return new Promise((resolve, reject) => {
            this._accountService.identity()
                .then(identity => {
                    this._identity = identity;
                    resolve();
                }).catch(() => reject());
        });
    }

    getInterestedWorkContracts(): Promise<Array<WorkContract>> {
        return new Promise((resolve, reject) => {
            this._workService.getActiveContracts(Number(this.workId))
                .subscribe((response: Array<WorkContract>) => {
                    this.onWorkContractsChanged.next(response);
                    resolve(response);
                }, reject);
        });
    }

    accept(hoursNumberEstimation): Observable<void> {
        return this._workService.accept(this.workId, hoursNumberEstimation);
    }

    refresh(): Promise<any> {
        return this.load();
    }

    private load(): Promise<any> {
        return new Promise((resolve, reject) => {
            Promise.all([
                this.getWork(),
                this.getInterestedWorkContracts(),
                this.getIdentity()
            ]).then(
                () => {
                    resolve(this._identity);
                },
                reject
            );
        });
    }
}
