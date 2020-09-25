import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {fuseAnimations} from '@fuse/animations';
import {ActivatedRoute} from '@angular/router';
import {RouteService} from '../../../../core';
import {FuseConfigService} from '../../../../../@fuse/services/config.service';
import {WorkerProfileService} from '../Worker-profile.service';
import {
    WorkerProfessionalInformation,
    WorkerProfessionalInformationFormStatus
} from '../../../components/worker/worker-form/worker-professional-information-form/worker-professional-information.model';
import {
    WorkerServiceModel,
    WorkerServicesStatus
} from '../../../components/worker/worker-services/worker-service.model';
import {
    WorkerIdentityDocument,
    WorkerIdentityDocumentFormStatus
} from '../../../components/worker/worker-form/worker-identity-document-form/identity-document.model';
import {PersonalInformation} from '../../../components/worker/worker-form/worker-personel-information-form/worker-personal-information.model';
import {WorkerService} from '../../worker.service';


@Component({
    selector: 'e-commerce-product',
    templateUrl: './worker-profile-edit.component.html',
    styleUrls: ['./worker-profile-edit.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class WorkerProfileEditComponent implements OnInit, OnDestroy {
    professionalInformation: WorkerProfessionalInformation;
    personalInformation: PersonalInformation;
    services: Array<WorkerServiceModel>;
    identityDocument: WorkerIdentityDocument;
    professionalInformationStatus: WorkerProfessionalInformationFormStatus;
    servicesStatus: WorkerServicesStatus;
    identityDocumentStatus: WorkerIdentityDocumentFormStatus;
    onIdentityDocumentChanged: BehaviorSubject<WorkerIdentityDocument>;


    // Private
    private _unsubscribeAll: Subject<any>;

    constructor(
        private _workerProfileService: WorkerProfileService,
        private _workerService: WorkerService,
        private _route: ActivatedRoute,
        private _routeService: RouteService,
        private _fuseConfigService: FuseConfigService
    ) {
        this._unsubscribeAll = new Subject();
        this.configureLayout();
    }

    get isProfessionalInformationFormValid(): boolean {
        if (!this.professionalInformationStatus) {
            return false;
        }
        return this.professionalInformationStatus.status === 'VALID';
    }

    get isIdentityDocumentFormValid(): boolean {
        if (!this.identityDocumentStatus) {
            return false;
        }
        return this.identityDocumentStatus.status === 'VALID';
    }

    get isServicesFormValid(): boolean {
        if (!this.servicesStatus) {
            return false;
        }
        return this.servicesStatus.status === 'VALID';
    }

    ngOnInit(): void {
        this.subscribeToPersonalInformationChange();
        this.subscribeToProfessionalInformationChange();
        this.subscribeToServicesChange();
        this.subscribeToIdentityDocumentChange();
    }

    saveProfessionalInformation(): void {
        this._workerService.updateProfessionalInformation(this._workerProfileService.workerId, this.professionalInformationStatus.data).toPromise()
            .then((savedProfessionalInformation: WorkerProfessionalInformation) => {
                this._workerProfileService.onProfessionalInformationChanged.next(savedProfessionalInformation);
                this._routeService.navigateToWorkerProfile(this._workerProfileService.workerId);
            });
    }

    saveServices(): void {
        console.log('workerId',this._workerProfileService.workerId);
        console.log('data',this.servicesStatus.data);
        this._workerService.updateServices(this._workerProfileService.workerId, this.servicesStatus.data).toPromise()
            .then((updatedServices: Array<WorkerServiceModel>) => {
                this._workerProfileService.onServicesChanged.next(updatedServices);
                this._routeService.navigateToWorkerProfile(this._workerProfileService.workerId);
            });
    }


    saveIdentityDocument(): void {
        this._workerService.updateIdentityDocuments(this._workerProfileService.workerId, this.identityDocumentStatus.data.toRequest()).toPromise()
            .then((updatedWorkerIdentityDocument: WorkerIdentityDocument) => {
                this._workerProfileService.onIdentityDocumentChanged.next(updatedWorkerIdentityDocument);
                this._routeService.navigateToWorkerProfile(this._workerProfileService.workerId);
            });
    }

    navigateToProfile(): void {
        this._routeService.navigateToWorkerProfile(this._workerProfileService.workerId);
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    professionalInformationChanged($event: WorkerProfessionalInformationFormStatus): void {
        this.professionalInformationStatus = $event;
    }

    serviceChanged($event: WorkerServicesStatus): void {
        this.servicesStatus = $event;
    }

    identityDocumentChanged($event: WorkerIdentityDocumentFormStatus): void {
        this.identityDocumentStatus = $event;
    }

    private subscribeToPersonalInformationChange(): void {
        this._workerProfileService.onPersonalInformationChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((personalInformation: PersonalInformation) => {
                this.personalInformation = personalInformation;
            });
    }

    private subscribeToProfessionalInformationChange(): void {
        this._workerProfileService.onProfessionalInformationChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((professionalInformation: WorkerProfessionalInformation) => {
                this.professionalInformation = new WorkerProfessionalInformation(professionalInformation);
            });
    }

    private subscribeToServicesChange(): void {
        this._workerProfileService.onServicesChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((services: Array<WorkerServiceModel>) => this.services = services);
    }

    private subscribeToIdentityDocumentChange(): void {
        this._workerProfileService.onIdentityDocumentChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((identityDocument: WorkerIdentityDocument) => {
                this.identityDocument = identityDocument;
            });
    }

    private configureLayout(): void {
        this._fuseConfigService.config = {
            layout: {
                navbar: {
                    hidden: false
                },
                toolbar: {
                    hidden: false,
                    position: 'above-fixed'
                },
                footer: {
                    hidden: false,
                    position: 'above-static'
                },
                sidepanel: {
                    hidden: true
                }
            }
        };
    }
}
