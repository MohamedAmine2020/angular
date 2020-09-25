import {AfterViewInit, Component, Input, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {fuseAnimations} from '../../../../../@fuse/animations';
import {WorkContract} from '../../../work/work-contract.model';

@Component({
    selector: 'wait-client-approve-work-done',
    templateUrl: './wait-client-approve-work-done.component.html',
    styleUrls: ['./wait-client-approve-work-done.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class WaitClientApproveWorkDoneComponent implements OnInit, OnDestroy, AfterViewInit {

    @Input()
    contract: WorkContract;

    constructor() {
    }

    ngOnInit(): void {
    }

    ngOnDestroy(): void {
    }

    ngAfterViewInit(): void {
    }

}
