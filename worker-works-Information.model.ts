export class WorkerWorksInformation {

    id: number;
    firstName: string;
    lastName: string;
    image: string;
    presentation: string;
    jobDoneNumber: number;
    evaluations: Array<any>;

    constructor(worker) {
        this.id = worker.id;
        this.firstName = worker.firstName || '';
        this.lastName = worker.lastName || '';
        this.image = worker.image || 'assets/images/avatars/profile.jpg';
        this.presentation = worker.presentation || '';
        this.jobDoneNumber = worker.jobDoneNumber || 0;
        this.evaluations = worker.evaluations;
    }
}
