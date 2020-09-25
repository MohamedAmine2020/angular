import {CompleteProfileStep} from './cmplete-profile-step.model';
import {WorkerProfessionalInformation} from '../../components/worker/worker-form/worker-professional-information-form/worker-professional-information.model';
import {PersonalInformation} from '../../components/worker/worker-form/worker-personel-information-form/worker-personal-information.model';
import {WorkerIdentityDocument} from '../../components/worker/worker-form/worker-identity-document-form/identity-document.model';
import {WorkerServiceModel} from '../../components/worker/worker-services/worker-service.model';

export class CompleteProfileSteps {

    personalInformationStep: CompleteProfileStep<PersonalInformation> =
        new CompleteProfileStep('Informations personnelles', false, new PersonalInformation({}));
    professionalInformationStep: CompleteProfileStep<WorkerProfessionalInformation> =
        new CompleteProfileStep('Informations professionnelles', false, new WorkerProfessionalInformation({}));
    /* identityDocumentStep: CompleteProfileStep<WorkerIdentityDocument> =
         new CompleteProfileStep('Documents d\'identité', false, new WorkerIdentityDocument({}));*/
    servicesStep: CompleteProfileStep<Array<WorkerServiceModel>> =
        new CompleteProfileStep('Services', false, []);

    public asArray(): Array<CompleteProfileStep<any>> {
        return [this.personalInformationStep, this.professionalInformationStep, this.servicesStep];
    }
}
