import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {fuseAnimations} from '../../../../@fuse/animations';
import 'moment/locale/fr';
import {WorkerWorkDetailsService} from './worker-work-details.service';
import {Work} from '../../work/work.model';
import {Account, AccountService, RouteService, SpinnerService} from '../../../core';
import {FuseConfigService} from '../../../../@fuse/services/config.service';
import {WorkContract} from '../../work/work-contract.model';
import {SocketService} from '../../../core/socket/socket.service';
import {ActivatedRoute} from '@angular/router';
import {WorkerService} from "../worker.service";
import {MatDialog} from "@angular/material/dialog";

@Component({
    selector: 'worker-work-details',
    templateUrl: './worker-work-details.component.html',
    styleUrls: ['./worker-work-details.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class WorkerWorkDetailsComponent implements OnInit, OnDestroy {

    work: Work;
    worksContracts: Array<WorkContract>;
    acceptedContract: WorkContract;
    doneContract: WorkContract;
    paidContract: WorkContract;
    offeredContract: WorkContract;
    offerApprovedContract: WorkContract;
    startedContract: WorkContract;
    reviewedContract: WorkContract;
    closedContract: WorkContract;
    identity: Account;
    _workerService: WorkerService;
    private _matDialog: MatDialog;


    private _unsubscribeAll: Subject<any>;

    constructor(private _applyToWorkService: WorkerWorkDetailsService,
                private _routeService: RouteService,
                private _fuseConfigService: FuseConfigService,
                private _accountService: AccountService,
                private _socketService: SocketService,
                private _workerWorkDetailsService: WorkerWorkDetailsService,
                private _spinnerService: SpinnerService,
                private _route: ActivatedRoute
    ) {
        this._unsubscribeAll = new Subject();
        this.configureLayout();
    }

    ngOnInit(): void {
        this.identity = this._route.snapshot.data.identity;
        this._applyToWorkService.onWorkChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((work: Work) => {
                this.work = new Work(work);
            });

        // Subscribe to update works on changes
        this._applyToWorkService.onWorkContractsChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(worksContracts => {
                this.worksContracts = worksContracts.map(workContract => new WorkContract(workContract));
                this.acceptedContract = this.worksContracts.find((contract: WorkContract) => contract.isAccepted && this.isContractAffectedToCurrentWorker(contract));
                this.doneContract = this.worksContracts.find((contract: WorkContract) => contract.isDone && this.isContractAffectedToCurrentWorker(contract));
                this.paidContract = this.worksContracts.find((contract: WorkContract) => contract.isPaid && this.isContractAffectedToCurrentWorker(contract));
                this.offeredContract = this.worksContracts.find((contract: WorkContract) => contract.isOffered && this.isContractAffectedToCurrentWorker(contract));
                this.offerApprovedContract = this.worksContracts.find((contract: WorkContract) => contract.isOfferApproved && this.isContractAffectedToCurrentWorker(contract));
                this.startedContract = this.worksContracts.find((contract: WorkContract) => contract.isStarted && this.isContractAffectedToCurrentWorker(contract));
                this.reviewedContract = this.worksContracts.find((contract: WorkContract) => contract.isReviewed && this.isContractAffectedToCurrentWorker(contract));
                this.closedContract = this.worksContracts.find((contract: WorkContract) => contract.isClosed && this.isContractAffectedToCurrentWorker(contract));
            });

        this.subscribeToWebsocket();
        this.onSocketConnectionLostRenewSubscription();
    }

    isContractAffectedToCurrentWorker(contract): boolean {
        return this.identity.id === contract.worker.id;
    }

    isWorkerAcceptedWork(): WorkContract {
        return (this.acceptedContract
            || this.offeredContract
            || this.paidContract
            || this.offerApprovedContract
            || this.doneContract
            || this.startedContract
            || this.reviewedContract
            || this.closedContract);
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
        this._socketService.unsubscribe();
    }

    navigateToDashboard(): void {
        this._routeService.navigateToDashboard(this._accountService.getIdentity().id);
    }

    private subscribeToWebsocket(): void {
        this._accountService.identity().then((identity: Account) => {
            this.identity = identity;
            this._socketService.subscribeToWorkStatusQueue(new Account(identity).id);
            this._socketService.receiveWorkStatusChanges()
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(response => {
                    if (Number(response.workId) !== this.work.id) {
                        return;
                    }
                    this._workerWorkDetailsService
                        .refresh()
                        .then(() => {
                            this._spinnerService.hide();
                        })
                        .catch(() => {
                            this._spinnerService.hide();
                        });
                });
        });
    }

    private onSocketConnectionLostRenewSubscription(): void {
        this._socketService.onSocketReconnected.pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this._socketService.unsubscribe();
                this.subscribeToWebsocket();
            });
    }

    private configureLayout(): void {
        this._fuseConfigService.config = {
            layout: {
                navbar: {
                    hidden: false,
                    position: 'left'
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
