import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {fuseAnimations} from '@fuse/animations';
import {Work} from '../../../work/work.model';
import {WorkerDashboardResolver} from '../worker-dashboard.resolver';

@Component({
    selector: 'worker-work-list',
    templateUrl: './work-list.component.html',
    styleUrls: ['./work-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class WorkListComponent implements OnInit, OnDestroy {
    works: Work[];

    // Private
    private _unsubscribeAll: Subject<any>;


    constructor(
        private _activatedRoute: ActivatedRoute,
        private _workerDashboardService: WorkerDashboardResolver,
    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    ngOnInit(): void {
        // Subscribe to update works on changes
        this._workerDashboardService.onActiveWorksChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(works => {
                this.works = works;
            });
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

}
