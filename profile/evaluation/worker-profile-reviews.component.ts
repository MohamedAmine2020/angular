import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {WorkerProfileService} from '../Worker-profile.service';
import {fuseAnimations} from '../../../../../@fuse/animations';
import {ReviewSummary} from '../../../components/work/work-review/reviews-summary/review-summary.model';


@Component({
    selector: 'worker-profile-reviews',
    templateUrl: './worker-profile-reviews.component.html',
    styleUrls: ['./worker-profile-reviews.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class WorkerProfileReviewsComponent implements OnInit, OnDestroy {

    reviewSummary: ReviewSummary;

    private _unsubscribeAll: Subject<any>;

    constructor(
        private _profileService: WorkerProfileService,
    ) {
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        this._profileService.onReviewsSummaryChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((reviewSummary: ReviewSummary) => {
                this.reviewSummary = reviewSummary;
            });
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }


}
