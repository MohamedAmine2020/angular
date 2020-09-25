import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {TranslateService} from '@ngx-translate/core';
import {SnackService} from '../../../../components/snack/snack.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'worked-hours-number-changed-dialog',
    templateUrl: './worked-hours-number-changed-dialog.component.html',
    styleUrls: ['./worked-hours-number-changed-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class WorkedHoursNumberChangedDialogComponent implements OnInit {

    dialogTitle: string;
    error: any;
    form: FormGroup;

    constructor(
        public matDialogRef: MatDialogRef<WorkedHoursNumberChangedDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _translateService: TranslateService,
        private _snackService: SnackService,
        private _formBuilder: FormBuilder
    ) {
        this.dialogTitle = 'approve-work-input.worked-hours-number-changed-dialog.title';
    }

    ngOnInit(): void {
        this.form = this._buildForm();
    }

    approve(): void {
        const formRawValue = this.form.getRawValue();
        const message = formRawValue.message;
        this.matDialogRef.close({
            message: message
        });
    }

    private _buildForm(): FormGroup {
        return this._formBuilder.group({
            message: ['', [
                Validators.required,
                Validators.maxLength(500),
                Validators.minLength(20)
            ]
            ]
        });
    }

}
