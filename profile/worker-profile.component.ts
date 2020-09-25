import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {Subject} from 'rxjs';
import {FuseConfigService} from '../../../../@fuse/services/config.service';
import {takeUntil} from 'rxjs/operators';
import {fuseAnimations} from '../../../../@fuse/animations';
import {WorkerProfileService} from './Worker-profile.service';
import {WorkerServiceModel} from '../../components/worker/worker-services/worker-service.model';
import {RouteService} from '../../../core';
import {PersonalInformation} from '../../components/worker/worker-form/worker-personel-information-form/worker-personal-information.model';
import {ReviewSummary} from '../../components/work/work-review/reviews-summary/review-summary.model';


@Component({
    selector: 'worker-profile',
    templateUrl: './worker-profile.component.html',
    styleUrls: ['./worker-profile.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class WorkerProfileComponent implements OnInit, OnDestroy {

    services: Array<WorkerServiceModel>;
    personalInformation: PersonalInformation;
    reviewRatingAvg: number;

    private _unsubscribeAll: Subject<any>;

    constructor(
        private _profileService: WorkerProfileService,
        private _fuseConfigService: FuseConfigService,
        private _routeService: RouteService
    ) {
        this._unsubscribeAll = new Subject();
        this.configureLayout();
    }

    ngOnInit(): void {
        this._profileService.onServicesChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((services: Array<WorkerServiceModel>) => {
                this.services = services;
            });
        this._profileService.onPersonalInformationChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((personalInformation: PersonalInformation) => {
                this.personalInformation = personalInformation;
            });

        this._profileService.onReviewsSummaryChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((reviewSummary: ReviewSummary) => {
                this.reviewRatingAvg = reviewSummary.ratingAvg;
            });

    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    navigateToWorkerUpdate(): void {
        this._routeService.navigateToWorkerEditProfile(this._profileService.workerId);
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
