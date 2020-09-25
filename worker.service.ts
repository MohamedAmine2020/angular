import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {WorkerProfileModel} from './worker-profile.model';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';
import {WorkerProfessionalInformation} from '../components/worker/worker-form/worker-professional-information-form/worker-professional-information.model';
import {WorkerIdentityDocument} from '../components/worker/worker-form/worker-identity-document-form/identity-document.model';
import {WorkerServiceModel} from '../components/worker/worker-services/worker-service.model';
import {Work} from '../work/work.model';
import {ReviewSummary} from '../components/work/work-review/reviews-summary/review-summary.model';
import {Account} from '../../core';


@Injectable({providedIn: 'root'})
export class WorkerService {

    private readonly WORKER_API_URL: string = environment.SERVER_API_URL + 'api/workers';
    
    private readonly WORKER_MINIMAL_CREATE_API_URL: string = environment.SERVER_API_URL + 'api/workers/minimal-create';

    constructor(private _httpClient: HttpClient) {
    }

    create(worker: WorkerProfileModel): Observable<WorkerProfileModel> {
        return this._httpClient.post<WorkerProfileModel>(`${this.WORKER_API_URL}`, worker);
    }

    minimalCreate(worker: WorkerProfileModel): Observable<WorkerProfileModel> {
        return this._httpClient.post<WorkerProfileModel>(`${this.WORKER_MINIMAL_CREATE_API_URL}`, worker);
    }

    getProfessionalInformation(workerId: number): Observable<WorkerProfessionalInformation> {
        return this._httpClient.get<WorkerProfessionalInformation>(`${this.WORKER_API_URL}/professional-information/${workerId}`);
    }

    updateProfessionalInformation(workerId: number, professionalInformation: WorkerProfessionalInformation): Observable<WorkerProfessionalInformation> {
        return this._httpClient.put<WorkerProfessionalInformation>(`${this.WORKER_API_URL}/professional-information/${workerId}`,
            professionalInformation.toRequest()
        );
    }

    updateProfessionalInformationApproveWork(workerId: number, professionalInformation: WorkerProfessionalInformation): Observable<WorkerProfessionalInformation> {
        return this._httpClient.put<WorkerProfessionalInformation>(`${this.WORKER_API_URL}/professional-information/${workerId}`,
            professionalInformation
        );
    }

    getIdentityDocument(workerId: number): Observable<WorkerIdentityDocument> {
        return this._httpClient.get<WorkerIdentityDocument>(`${this.WORKER_API_URL}/identity-document/${workerId}`);
    }

    updateIdentityDocuments(workerId: number, identityDocument: WorkerIdentityDocument): Observable<WorkerIdentityDocument> {
        return this._httpClient.put<WorkerIdentityDocument>(`${this.WORKER_API_URL}/identity-document/${workerId}`, identityDocument);
    }

    getServices(workerId: number): Observable<Array<WorkerServiceModel>> {
        return this._httpClient.get<Array<WorkerServiceModel>>(`${this.WORKER_API_URL}/services/${workerId}`);
    }

    updateServices(workerId: number, services: Array<WorkerServiceModel>): Observable<Array<WorkerServiceModel>> {
        return this._httpClient.put<Array<WorkerServiceModel>>(`${this.WORKER_API_URL}/services/${workerId}`,
            services.map(service => service.toRequest())
        );
    }

    isProfileCompleted(id: number): Observable<boolean> {
        return this._httpClient.get<boolean>(`${this.WORKER_API_URL}/is-profile-completed/${id}`);
    }

    getPotentialWorks(): Observable<Array<Work>> {
        return this._httpClient.get<Array<Work>>(`${this.WORKER_API_URL}/potential-works`);
    }

    getActiveWorks(): Observable<Array<Work>> {
        return this._httpClient.get<Array<Work>>(`${this.WORKER_API_URL}/active-works`);
    }

    getReviewsSummary(workerId: number): Observable<ReviewSummary> {
        return this._httpClient.get<ReviewSummary>(`${this.WORKER_API_URL}/reviews-summary/${workerId}`);
    }

    searchWorkers(searchText: string): Observable<Array<Account>> {
        return this._httpClient.get<Array<Account>>(`${this.WORKER_API_URL}/search`, {
            params: new HttpParams().set('searchText', searchText)
        });
    }

    hasIdentityDocument(): Observable<boolean> {
        return this._httpClient.get<boolean>(`${this.WORKER_API_URL}/has-identity-document`);
    }

}
