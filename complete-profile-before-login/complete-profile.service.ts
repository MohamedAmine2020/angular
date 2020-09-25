import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {WorkerProfileModel} from '../worker-profile.model';
import {WorkerService} from '../worker.service';
import {AccountService} from '../../../core';
import {PersonalInformation} from '../../components/worker/worker-form/worker-personel-information-form/worker-personal-information.model';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {BehaviorSubject, Observable} from 'rxjs';


@Injectable({providedIn: 'root'})
export class CompleteProfileBeforeLoginService implements Resolve<any> {


    private _onWorkerChange: BehaviorSubject<WorkerProfileModel>;

    constructor(private _http: HttpClient,
                private _workerService: WorkerService,
                private _accountService: AccountService) {
        this._onWorkerChange = new BehaviorSubject(new WorkerProfileModel({}));
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        return new Promise((resolve) => {
            Promise.all([
                this.getCurrentWorker()
            ]).then(
                () => {
                    resolve();
                },
            );
        });
    }

    public completeProfile(worker: WorkerProfileModel, personalInformation: PersonalInformation): Promise<void> {
        return new Promise((resolve, reject) => {
            Promise.all([
                this._workerService.create(worker).toPromise(),
                this._accountService.updateAccount(personalInformation.toRequest())
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    public completeProfileAfterAuthPhone(worker: WorkerProfileModel): Promise<void> {
      
        return new Promise((resolve, reject) => {
            Promise.all([
                this._workerService.create(worker).toPromise()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    public completeMinimalProfileWorker(worker: WorkerProfileModel): Promise<void> {
      
        return new Promise((resolve, reject) => {
            Promise.all([
                this._workerService.minimalCreate(worker).toPromise()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    private getCurrentWorker(): void {
        this._onWorkerChange.next(new WorkerProfileModel({}));
    }
}
