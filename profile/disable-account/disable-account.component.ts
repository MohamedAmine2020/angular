import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {fuseAnimations} from '../../../../../@fuse/animations';
import {WorkerIdentityDocument} from '../../../components/worker/worker-form/worker-identity-document-form/identity-document.model';
import {Subject} from 'rxjs';
import {WorkerProfileService} from '../Worker-profile.service';
import {SpinnerService, UserService} from '../../../../core';
import {takeUntil} from 'rxjs/operators';
import {PersonalInformation} from '../../../components/worker/worker-form/worker-personel-information-form/worker-personal-information.model';
import {MatSlideToggleChange} from '@angular/material';

@Component({
    selector: 'disable-account',
    templateUrl: './disable-account.component.html',
    styleUrls: ['./disable-account.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class DisableAccountComponent implements OnInit, OnDestroy {

    identityDocument: WorkerIdentityDocument;
    images: Array<string>;

    private _unsubscribeAll: Subject<any>;
    private userId: number;

    constructor(
        private _profileService: WorkerProfileService,
        private _userService: UserService,
        private _spinnerService: SpinnerService,
    ) {
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {

        this._profileService.onPersonalInformationChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((personalInformation: PersonalInformation) => {
                this.userId = personalInformation.id;
            });
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }


    updateDisabled($event: MatSlideToggleChange): void {
        this._spinnerService.show();
        if ($event.checked) {
            this._userService.disable(this.userId)
                .subscribe(value => {
                    this._profileService.onPersonalInformationChanged.next(new PersonalInformation(value));
                    this._spinnerService.hide();

                });
        } else {
            this._userService.enable(this.userId)
                .subscribe(value => {
                    this._profileService.onPersonalInformationChanged.next(new PersonalInformation(value));
                    this._spinnerService.hide();

                });
        }
    }
}
