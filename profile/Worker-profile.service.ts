import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {BehaviorSubject, Observable} from 'rxjs';
import {WorkerService} from '../worker.service';
import {WorkerProfessionalInformation} from '../../components/worker/worker-form/worker-professional-information-form/worker-professional-information.model';
import {WorkerServiceModel} from '../../components/worker/worker-services/worker-service.model';
import {WorkerIdentityDocument} from '../../components/worker/worker-form/worker-identity-document-form/identity-document.model';
import {Account, UserService} from '../../../core';
import {PersonalInformation} from '../../components/worker/worker-form/worker-personel-information-form/worker-personal-information.model';
import {ReviewSummary} from '../../components/work/work-review/reviews-summary/review-summary.model';

@Injectable()
export class WorkerProfileService implements Resolve<any> {

    workerId: number;
    onProfessionalInformationChanged: BehaviorSubject<WorkerProfessionalInformation>;
    onServicesChanged: BehaviorSubject<Array<WorkerServiceModel>>;
    onPersonalInformationChanged: BehaviorSubject<PersonalInformation>;
    onIdentityDocumentChanged: BehaviorSubject<WorkerIdentityDocument>;
    onReviewsSummaryChanged: BehaviorSubject<ReviewSummary>;

    constructor(
        private _workerService: WorkerService,
        private _userService: UserService
    ) {
        this.onProfessionalInformationChanged = new BehaviorSubject(new WorkerProfessionalInformation({}));
        this.onServicesChanged = new BehaviorSubject([]);
        this.onPersonalInformationChanged = new BehaviorSubject(new PersonalInformation({}));
        this.onIdentityDocumentChanged = new BehaviorSubject(new WorkerIdentityDocument({}));
        this.onReviewsSummaryChanged = new BehaviorSubject(new ReviewSummary({}));
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        this.workerId = route.params.workerId;
        return new Promise((resolve, reject) => {
            Promise.all([
                this.getProfessionalInformation(this.workerId),
                this.getServices(this.workerId),
                // this.getIdentityDocument(this.workerId),
                this.getPersonalInformation(this.workerId),
                this.getReviewsSummary(this.workerId)
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    getProfessionalInformation(id: number): Promise<WorkerProfessionalInformation> {
        return new Promise<WorkerProfessionalInformation>(((resolve, reject) => {
            this._workerService.getProfessionalInformation(id)
                .subscribe((professionalInformation: WorkerProfessionalInformation) => {
                    const workerProfessionalInformation: WorkerProfessionalInformation = new WorkerProfessionalInformation(professionalInformation);
                    this.onProfessionalInformationChanged.next(professionalInformation);
                    resolve(workerProfessionalInformation);
                }, reject);
        }));
    }

    getServices(id: number): Promise<Array<WorkerServiceModel>> {
        return new Promise<Array<WorkerServiceModel>>(((resolve, reject) => {
            this._workerService.getServices(id)
                .subscribe((services: Array<WorkerServiceModel>) => {
                    const serviceModels: Array<WorkerServiceModel> = services.map(service => new WorkerServiceModel(service));
                    this.onServicesChanged.next(serviceModels);
                    resolve(serviceModels);
                }, reject);
        }));
    }

    /* getIdentityDocument(id: number): Promise<WorkerIdentityDocument> {
         return new Promise<WorkerIdentityDocument>(((resolve, reject) => {
             this._workerService.getIdentityDocument(id)
                 .subscribe((workerIdentityDocument: WorkerIdentityDocument) => {
                     const identityDocument = new WorkerIdentityDocument(workerIdentityDocument);
                     this.onIdentityDocumentChanged.next(identityDocument);
                     resolve(identityDocument);
                 }, reject);
         }));
     }
 */
    getPersonalInformation(id: number): Promise<PersonalInformation> {
        return new Promise<PersonalInformation>(((resolve, reject) => {
            this._userService.get(id)
                .subscribe((account: Account) => {
                    const personalInformation = new PersonalInformation(account);
                    this.onPersonalInformationChanged.next(personalInformation);
                    resolve(personalInformation);
                }, reject);
        }));

    }

    private getReviewsSummary(workerId: number): Promise<ReviewSummary> {
        return new Promise<ReviewSummary>(((resolve, reject) => {
            this._workerService.getReviewsSummary(workerId)
                .subscribe((summary: ReviewSummary) => {
                    const reviewSummary = new ReviewSummary(summary);
                    this.onReviewsSummaryChanged.next(reviewSummary);
                    resolve(reviewSummary);
                }, reject);
        }));
    }
}
