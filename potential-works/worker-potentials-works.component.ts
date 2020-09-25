import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {fuseAnimations} from '@fuse/animations';
import {WorkerPotentialsWorksService} from './worker-potentials-works.service';
import {FuseConfigService} from '../../../../@fuse/services/config.service';
import {RouteService} from '../../../core';
import {Work} from '../../work/work.model';


@Component({
    selector: 'create-work',
    templateUrl: './worker-potentials-works.component.html',
    styleUrls: ['./worker-potentials-works.component.scss'],
    animations: fuseAnimations
})
export class WorkerPotentialsWorksComponent implements OnInit, OnDestroy {

    workTypes: any[];
    works: Array<Work>;
    worksFilteredByCategory: Array<Work>;
    filteredWorks: Array<Work>;
    currentWorkType: string;
    searchTerm: string;

    // Private
    private _unsubscribeAll: Subject<any>;

    constructor(
        private _potentialWorksService: WorkerPotentialsWorksService,
        private _fuseConfigService: FuseConfigService,
        private _routeService: RouteService
    ) {
        // Set the defaults
        this.currentWorkType = 'all';
        this.searchTerm = '';

        // Set the private defaults
        this._unsubscribeAll = new Subject();
        this.configureLayout();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this._potentialWorksService.onWorkTypesChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(workTypes => this.workTypes = workTypes);

        this._potentialWorksService.onPotentialWorksChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(works => {
                this.filteredWorks = this.worksFilteredByCategory = this.works = works;
            });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    filterWorksByType(): void {
        // Filter
        if (this.currentWorkType === 'all') {
            this.worksFilteredByCategory = this.works;
            this.filteredWorks = this.works;
        } else {
            this.worksFilteredByCategory = this.works.filter((work: Work) => {
                return work.service.category.label === this.currentWorkType;
            });

            this.filteredWorks = [...this.worksFilteredByCategory];

        }

        this.filterWorksByTerm();
    }


    filterWorksByTerm(): void {
        const searchTerm = this.searchTerm.toLowerCase();

        // Search
        if (searchTerm === '') {
            this.filteredWorks = this.worksFilteredByCategory;
        } else {
            this.filteredWorks = this.worksFilteredByCategory.filter((work: Work) => {
                return work.title.toLowerCase().includes(searchTerm);
            });
        }
    }

    navigateToWorkDetails(workId: number): void {
        this._routeService.navigateToWorkDetails(workId);
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
