import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {WorkerProfileService} from '../Worker-profile.service';
import {fuseAnimations} from '../../../../../@fuse/animations';
import {PersonalInformation} from '../../../components/worker/worker-form/worker-personel-information-form/worker-personal-information.model';


@Component({
    selector: 'worker-profile-personal-information',
    templateUrl: './worker-profile-personal-information.component.html',
    styleUrls: ['./worker-profile-personal-information.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class WorkerProfilePersonalInformationComponent implements OnInit, OnDestroy {

    personalInformation: PersonalInformation;

    private _unsubscribeAll: Subject<any>;

    constructor(
        private _profileService: WorkerProfileService,
    ) {
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        this._profileService.onPersonalInformationChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((personalInformation: PersonalInformation) => this.personalInformation = personalInformation);
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

}
