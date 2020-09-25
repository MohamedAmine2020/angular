import {Component, Input, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {Subject} from 'rxjs';
import {Work} from '../../../../work/work.model';
import {LanguageService, RouteService, SpinnerService} from '../../../../../core';
import {MatDialog, MatDialogRef} from '@angular/material';
import {WorkService} from '../../../../work/work.service';
import {ConfirmDialogComponent} from '../../../../components/confirm-dialog/confirm-dialog.component';
import {takeUntil} from 'rxjs/operators';
import {WorkerDashboardResolver} from '../../worker-dashboard.resolver';

@Component({
    selector: 'worker-potential-work-list-item',
    templateUrl: './potential-work-list-item.component.html',
    styleUrls: ['./potential-work-list-item.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class PotentialWorkListItemComponent implements OnInit, OnDestroy {

    @Input()
    work: Work;
    confirmDialogRef: MatDialogRef<ConfirmDialogComponent>;

    // Private
    private _unsubscribeAll: Subject<any>;


    constructor(private _matDialog: MatDialog,
                private _languageService: LanguageService,
                private _routeService: RouteService,
                private _workService: WorkService,
                private _spinnerService: SpinnerService,
                private _workerDashboardResolver: WorkerDashboardResolver) {
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        console.log('work',this.work)    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    navigateToWorkDetails(): void {
        this._routeService.navigateToWorkerWorkDetails(this.work.id);

    }


    refuseWork(): void {
      
        this.confirmDialogRef = this._matDialog.open(ConfirmDialogComponent, {
            disableClose: false,
            width: '500px'
        });
        const messageKey = 'worker-dashboard.message.confirmation.not-interested-in-work';
        this.confirmDialogRef.componentInstance.confirmMessage = this._languageService.translate(messageKey, {'workTitle': this.work.title});
        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                this._spinnerService.show();
                this._workService.refuse(this.work.id)
                    .pipe(takeUntil(this._unsubscribeAll))
                    .subscribe(() => {
                        this.refresh();
                    }, () => {
                        this.refresh();
                    });
            }
            this.confirmDialogRef = null;
        });
    }

    refresh(): void {
        this._workerDashboardResolver
            .refresh()
            .then(() => {
                this._spinnerService.hide();
            })
            .catch(() => {
                this._spinnerService.hide();
            });
    }

}
