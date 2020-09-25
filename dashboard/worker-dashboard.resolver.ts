import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {BehaviorSubject, Observable} from 'rxjs';
import {WorkerService} from '../worker.service';
import {Account, AccountService} from '../../../core';


@Injectable()
export class WorkerDashboardResolver implements Resolve<any> {

    onPotentialWorksChange: BehaviorSubject<any>;
    onActiveWorksChanged: BehaviorSubject<any>;

    private _identity: Account;

    constructor(private _workerService: WorkerService,
                private _accountService: AccountService) {
        this.onPotentialWorksChange = new BehaviorSubject({});
        this.onActiveWorksChanged = new BehaviorSubject({});
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        return this.load();
    }

    getPotentialWorks(): Promise<any> {
        return new Promise(resolve => {
            this._workerService.getPotentialWorks().subscribe(potentialWorks => {
                this.onPotentialWorksChange.next(potentialWorks);
                resolve();
            });
        });
    }

    getActiveWorks(): Promise<any> {
        return new Promise(resolve => {
            this._workerService.getActiveWorks().subscribe(activeWorks => {
                this.onActiveWorksChanged.next(activeWorks);
                resolve();
            });
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

    refresh(): Promise<any> {
        return this.load();
    }

    private load(): Promise<any> {
        return new Promise((resolve, reject) => {
            Promise.all([
                this.getIdentity(),
                this.getPotentialWorks(),
                this.getActiveWorks()
            ]).then(
                () => {
                    resolve(this._identity);
                },
                reject
            );
        });
    }

}
