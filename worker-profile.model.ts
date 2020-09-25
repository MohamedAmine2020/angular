import {WorkerServiceModel} from '../components/worker/worker-services/worker-service.model';
import {WorkerProfessionalInformation} from '../components/worker/worker-form/worker-professional-information-form/worker-professional-information.model';
import {WorkerIdentityDocument} from '../components/worker/worker-form/worker-identity-document-form/identity-document.model';

export class WorkerProfileModel {

    id: number;
    professionalInformation: WorkerProfessionalInformation;
    //identityDocument: WorkerIdentityDocument;
    services: Array<WorkerServiceModel>;

    constructor(worker) {
        this.id = worker.id;
        this.professionalInformation = worker.professionalInformation || new WorkerProfessionalInformation({});
        // this.identityDocument = worker.identityDocument || new WorkerIdentityDocument({});
        this.services = worker.services || [];
    }

    
}

