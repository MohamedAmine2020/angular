import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {WorkerProfessionalInformation} from '../../../components/worker/worker-form/worker-professional-information-form/worker-professional-information.model';
import {WorkerProfileService} from '../Worker-profile.service';
import {fuseAnimations} from '../../../../../@fuse/animations';


@Component({
    selector: 'worker-profile-work-preference',
    templateUrl: './worker-profile-work-preference.component.html',
    styleUrls: ['./worker-profile-work-preference.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class WorkerProfileWorkPreferenceComponent implements OnInit, OnDestroy {

    professionalInformation: WorkerProfessionalInformation;

    private _unsubscribeAll: Subject<any>;

    constructor(
        private _profileService: WorkerProfileService,
    ) {
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        this._profileService.onProfessionalInformationChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((professionalInformation: WorkerProfessionalInformation) => {
                this.professionalInformation = professionalInformation;
            });
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }


}
