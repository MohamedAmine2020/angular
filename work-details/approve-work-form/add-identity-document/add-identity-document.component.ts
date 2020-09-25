import {Component, OnInit, ViewChild, ViewEncapsulation} from "@angular/core";
import {fuseAnimations} from "../../../../../../@fuse/animations";
import {
    WorkerIdentityDocument,
    WorkerIdentityDocumentFormStatus
} from "../../../../components/worker/worker-form/worker-identity-document-form/identity-document.model";
import {WorkerProfileService} from "../../../profile/Worker-profile.service";
import {AccountService, RouteService, SpinnerService} from "../../../../../core";
import {WorkerService} from "../../../worker.service";
import {MatDialogRef} from '@angular/material/dialog';
import {WorkerIdentityDocumentFormComponent} from "../../../../components/worker/worker-form/worker-identity-document-form/worker-identity-document-form.component";
import {Work} from "../../../../work/work.model";

@Component({
    selector: 'add-identity-document',
    templateUrl: './add-identity-document.component.html',
    styleUrls: ['./add-identity-document.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class AddIdentityDocumentComponent implements OnInit {
    @ViewChild(WorkerIdentityDocumentFormComponent)
    identityDocumentform: WorkerIdentityDocumentFormComponent;
    identityDocumentStatus: WorkerIdentityDocumentFormStatus;
    identityDocument: WorkerIdentityDocument;

    constructor(
        private _workerProfileService: WorkerProfileService,
        private _workerService: WorkerService,
        private _accountService: AccountService,
        private _routeService: RouteService,
        private _spinnerService: SpinnerService,
        public dialogRef: MatDialogRef<AddIdentityDocumentComponent>
    ) {
    }

    get isIdentityDocumentFormValid(): boolean {
        if (!this.identityDocumentStatus) {
            return false;
        }
        return this.identityDocumentStatus.status === 'VALID';
    }

    ngOnInit(): void {
    }

    saveIdentityDocument() {
        const identity = this._accountService.getIdentity();
        this._workerService.updateIdentityDocuments(identity.id, this.identityDocumentStatus.data.toRequest()).toPromise()
            .then((updatedWorkerIdentityDocument: WorkerIdentityDocument) => {
                this._workerProfileService.onIdentityDocumentChanged.next(updatedWorkerIdentityDocument);
            });

        this.dialogRef.close({event: 'Cancel'});
    }

    identityDocumentChanged($event: WorkerIdentityDocumentFormStatus): void {
        this.identityDocumentStatus = $event;
    }
}