import {WorkerServiceModel} from '../components/worker/worker-services/worker-service.model';
import {PersonalInformation} from '../components/worker/worker-form/worker-personel-information-form/worker-personal-information.model';

export class WorkerModel {

    id: number;
    firstName: string;
    lastName: string;
    image: string;
    services: Array<WorkerServiceModel>;
    worksDoneNumber: number;
    ratingsNumber: number;
    ratingsAvg: number;
    phone: string;
    email: string;

    constructor(worker) {
        this.id = worker.id;
        this.firstName = worker.firstName || '';
        this.lastName = worker.lastName || '';
        this.image = worker.image || PersonalInformation.DEFAULT_IMAGE;
        this.services = worker.services || [];
        this.worksDoneNumber = worker.worksDoneNumber || 0;
        this.ratingsNumber = worker.ratingsNumber || 0;
        this.ratingsAvg = worker.ratingsAvg || 5;
        this.phone = worker.phone || '';
        this.email = worker.email || '';
    }
}

