import {Component, Input, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {Subject} from 'rxjs';
import {Work} from '../../../../work/work.model';
import {LanguageService, RouteService} from '../../../../../core';
import {MatDialog} from '@angular/material';
import {WorkService} from '../../../../work/work.service';
import {takeUntil} from 'rxjs/operators';
import {WorkContract} from '../../../../work/work-contract.model';

@Component({
    selector: 'worker-work-list-item',
    templateUrl: './work-list-item.component.html',
    styleUrls: ['./work-list-item.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class WorkListItemComponent implements OnInit, OnDestroy {

    @Input()
    work: Work;
    offeredWorkContract: WorkContract;


    // Private
    private _unsubscribeAll: Subject<any>;


    constructor(private _matDialog: MatDialog,
                private _languageService: LanguageService,
                private _routeService: RouteService,
                private _workService: WorkService) {

        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        this._workService.getOfferedContract(this.work.id)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(workContract => {
                this.offeredWorkContract = new WorkContract(workContract);
            });
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    navigateToWorkDetails(): void {
        this._routeService.navigateToWorkerWorkDetails(this.work.id);

    }

    navigateToClientProfile(): void {
        this._routeService.navigateToClientProfile(this.work.createdBy.id);
    }

}
