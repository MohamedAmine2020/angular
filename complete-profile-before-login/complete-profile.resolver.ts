import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {BehaviorSubject, Observable} from 'rxjs';
import {AccountService} from '../../../core';
import {IndicatorService} from '../../referential/indicator/indicator.service';

@Injectable()
export class CompleteProfileBeforeLoginResolver implements Resolve<any> {

    onPersonalInformationChange: BehaviorSubject<any>;
    onWorkIndicator: BehaviorSubject<any>;

    constructor(private _accountService: AccountService,
                private _indicatorService: IndicatorService) {
        this.onWorkIndicator = new BehaviorSubject({});
        this.onPersonalInformationChange = new BehaviorSubject({});
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        return new Promise((resolve, reject) => {
            Promise.all([
                this.getPersonalInformation(),
                this.getIndicators()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    getIndicators(): Promise<any> {
        return new Promise((resolve) => {
            this._indicatorService.getAll().then(data => {
                this.onWorkIndicator.next(data);
                resolve();
            });
        });
    }

    getPersonalInformation(): Promise<any> {
        return new Promise(((resolve) => {
            this._accountService.identity()
                .then(identity => {
                    this.onPersonalInformationChange.next(identity);
                    resolve();
                });
        }));
    }

}

