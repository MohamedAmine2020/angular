import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {BehaviorSubject, Observable} from 'rxjs';
import {WorkTypeService} from '../../referential';
import {WorkServiceService} from '../../referential/work/service/work-service.service';
import {WorkerService} from '../worker.service';

@Injectable()
export class WorkerPotentialsWorksService implements Resolve<any> {
    onWorkTypesChanged: BehaviorSubject<any>;
    onPotentialWorksChanged: BehaviorSubject<any>;

    constructor(
        private _workTypeService: WorkTypeService,
        private _workServiceService: WorkServiceService,
        private _workerService: WorkerService,
    ) {
        // Set the defaults
        this.onWorkTypesChanged = new BehaviorSubject({});
        this.onPotentialWorksChanged = new BehaviorSubject({});
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        return new Promise((resolve, reject) => {

            Promise.all([
                this.getWorkTypes(),
                this.getPotentialWorks()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    getWorkTypes(): Promise<any> {
        return new Promise((resolve) => {
            this._workTypeService.getAllWithServices()
                .then(categories => {
                    this.onWorkTypesChanged.next(categories);
                    resolve();
                });
        });
    }

    getPotentialWorks(): Promise<any> {
        return new Promise((resolve) => {
            this._workerService.getPotentialWorks().toPromise()
                .then(works => {
                    this.onPotentialWorksChanged.next(works);
                    resolve();
                });
        });
    }

}
