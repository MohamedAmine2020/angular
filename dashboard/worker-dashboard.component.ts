import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';

import {fuseAnimations} from '@fuse/animations';
import {FuseConfigService} from '../../../../@fuse/services/config.service';
import {Account, AccountService, LanguageService, RouteService, SpinnerService} from '../../../core';
import {FuseSidebarService} from '../../../../@fuse/components/sidebar/sidebar.service';
import {WorkerDashboardResolver} from './worker-dashboard.resolver';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {MatDialog} from '@angular/material';
import {SocketService} from '../../../core/socket/socket.service';
import {ActivatedRoute} from '@angular/router';
import {ACCEPTED, NOT_VERIFIED} from '../../referential/user/identity-status/identity-status.constants';


@Component({
    selector: 'worker-dashboard',
    templateUrl: './worker-dashboard.component.html',
    styleUrls: ['./worker-dashboard.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class WorkerDashboardComponent implements OnInit, OnDestroy {

    account: Account;
    potentialWorks: Array<any>;
    dateNow = Date.now();
    identity: Account;

    NOT_VERIFIED = NOT_VERIFIED;
    ACCEPTED = ACCEPTED;

    private _unsubscribeAll: Subject<any>;

    constructor(private _fuseConfigService: FuseConfigService,
                private _fuseSidebarService: FuseSidebarService,
                private accountService: AccountService,
                private _workerDashboardResolver: WorkerDashboardResolver,
                private _routeService: RouteService,
                private _accountService: AccountService,
                private _matDialog: MatDialog,
                private _languageService: LanguageService,
                private _spinnerService: SpinnerService,
                private _socketService: SocketService,
                private _route: ActivatedRoute) {
        this.configureLayout();
        setInterval(() => {
            this.dateNow = Date.now();
        }, 1000);
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        this.identity = this._route.snapshot.data.identity;
        this.subscribeToAuthenticationState();
        this._workerDashboardResolver.onPotentialWorksChange
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(potentialWorks => {
                this.potentialWorks = potentialWorks;
            });
        this.subscribeToWebsocket();
        this.onSocketConnectionLostRenewSubscription();
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
        this._socketService.unsubscribe();
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

    private subscribeToAuthenticationState(): void {
        this.accountService.getOnUserIdentityChange().subscribe(identity => this.account = identity);
    }

    private subscribeToWebsocket(): void {
        this._accountService.identity().then((identity: Account) => {
            this._socketService.subscribeToWorkStatusQueue(new Account(identity).id);
            this._socketService.receiveWorkStatusChanges()
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(() => {
                    setTimeout(() => {
                        this._workerDashboardResolver
                            .getPotentialWorks()
                            .then(() => {
                                this._spinnerService.hide();
                            });
                    }, 3000);

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

}
