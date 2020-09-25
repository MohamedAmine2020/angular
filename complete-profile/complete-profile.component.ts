import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    QueryList,
    ViewChildren,
    ViewEncapsulation
} from '@angular/core';
import {Subject} from 'rxjs';

import {fuseAnimations} from '@fuse/animations';
import {FusePerfectScrollbarDirective} from '@fuse/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive';
import {FuseSidebarService} from '@fuse/components/sidebar/sidebar.service';
import {FuseConfigService} from '../../../../@fuse/services/config.service';
import {WorkerProfileModel} from '../worker-profile.model';
import {
    PersonalInformation,
    WorkerPersonalInformationFormStatus
} from '../../components/worker/worker-form/worker-personel-information-form/worker-personal-information.model';
import {WorkerProfessionalInformationFormStatus} from '../../components/worker/worker-form/worker-professional-information-form/worker-professional-information.model';
import {WorkerServicesStatus} from '../../components/worker/worker-services/worker-service.model';
import {CompleteProfileStep} from './cmplete-profile-step.model';
import {CompleteProfileService} from './complete-profile.service';
import {AccountService, LanguageService, SpinnerService, PhoneValidator, RouteService} from '../../../core';
import {MatDialog, MatDialogRef} from '@angular/material';
import {InformationDialogComponent} from '../../components/information-dialog/information-dialog.component';
import {Router} from '@angular/router';
import {CompleteProfileSteps} from './complete-profile-steps.model';
import {takeUntil} from 'rxjs/operators';
import {CompleteProfileResolver} from './complete-profile.resolver';
import { StorageService } from 'app/core/storage/storage.service';
import { Meta } from '@angular/platform-browser';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'academy-course',
    templateUrl: './complete-profile.component.html',
    styleUrls: ['./complete-profile.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})

export class CompleteProfileComponent implements OnInit, OnDestroy, AfterViewInit {
    animationDirection: 'left' | 'right' | 'none';
    completeProfileSteps: CompleteProfileSteps;
    courseStepContent: any;
    currentStepIndex: number;
    registerForm: FormGroup;
    informationDialogRef: MatDialogRef<InformationDialogComponent>;
    @ViewChildren(FusePerfectScrollbarDirective)
    fuseScrollbarDirectives: QueryList<FusePerfectScrollbarDirective>;

    personalInformations: any;
    private _unsubscribeAll: Subject<any>;

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseSidebarService: FuseSidebarService,
        private _fuseConfigService: FuseConfigService,
        private _completeProfileService: CompleteProfileService,
        private _accountService: AccountService,
        private _routeService: RouteService,
        private _spinnerService: SpinnerService,
        private _matDialog: MatDialog,
        private _languageService: LanguageService,
        private _router: Router,
        private meta: Meta,
        private formBuilder: FormBuilder,
        private _workerCompleteProfileResolver: CompleteProfileResolver) {
        this.animationDirection = 'none';
        this.currentStepIndex = 0;
        this._unsubscribeAll = new Subject();
        this.configureLayout();
    }

    ngOnInit(): void {
        this.initRegisterForm();
        this. generateTags();
        this.completeProfileSteps = new CompleteProfileSteps();
        this._workerCompleteProfileResolver.onPersonalInformationChange
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(identity => this.completeProfileSteps.personalInformationStep.data = new PersonalInformation(identity));
    }

    ngAfterViewInit(): void {
        this.courseStepContent = this.fuseScrollbarDirectives.find((fuseScrollbarDirective) => {
            return fuseScrollbarDirective.elementRef.nativeElement.id === 'workerService-step-content';
        });
    }

    generateTags(){
        const config = {
            title: "Contactez des clients Wijaa et proposez vos services.",
            description: "Augmentez vos revenus en rendant des services à domicile près de chez vous en créant un profil en quelques minutes et répondez aux demandes de service autour de vous.",
            image: "https://wijaa.com/assets/images/logos/logo.png"
        };
        this.meta.updateTag({ name: "og:type", content: "website" });
        this.meta.updateTag({ name: "og:country-name", content: "canada" });
        this.meta.updateTag({ name: "og:site_name", content: "wijaa.com" });
        this.meta.updateTag({ name: "og:title", content: config.title });
        this.meta.updateTag({ name: "og:description", content: config.description });
        this.meta.updateTag({ name: "og:image", content: config.image });
        this.meta.updateTag({ name: "title", content: config.title });
        this.meta.updateTag({ name: "description", content: config.description });
      }

      private initRegisterForm(): void {
        this.registerForm = this.formBuilder.group({
            firstName: ['', [Validators.required, Validators.email]],
            lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
            email: ['', [Validators.required, Validators.email, Validators.maxLength(191)]],
            phone: ['', [Validators.required, PhoneValidator.validCanadaPhone()]]
        });
    }
    

    personalInformationChanged($event: WorkerPersonalInformationFormStatus): void {
        this.completeProfileSteps.personalInformationStep.isValid = $event.isValid();
        if ($event.isValid()) {
            this.completeProfileSteps.personalInformationStep.data = $event.data;
        }
    }

    professionalInformationChanged($event: WorkerProfessionalInformationFormStatus): void {
        this.completeProfileSteps.professionalInformationStep.isValid = $event.isValid();
        if ($event.isValid()) {
            this.completeProfileSteps.professionalInformationStep.data = $event.data;
        }
    }

    serviceChanged($event: WorkerServicesStatus): void {
        this.completeProfileSteps.servicesStep.isValid = $event.isValid();
        if ($event.isValid()) {
            this.completeProfileSteps.servicesStep.data = $event.data;
        }
    }

    /* identityDocumentChanged($event: WorkerIdentityDocumentFormStatus): void {
         this.completeProfileSteps.identityDocumentStep.isValid = $event.isValid();
         if ($event.isValid()) {
             this.completeProfileSteps.identityDocumentStep.data = $event.data;
         }
     }
 */
    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    gotoStep(stepIndex: number): void {
        /*if (this.isStepDisabled(stepIndex)) {
            return;
        }*/
        this.animationDirection = this.currentStepIndex < stepIndex ? 'left' : 'right';
        this._changeDetectorRef.detectChanges();
        this.currentStepIndex = stepIndex;
    }

    isCurrentStepNotValid(): boolean {
        return !this.getCurrentStep().isValid;
    }

    gotoNextStep(): void {
        if (this.currentStepIndex === this.completeProfileSteps.asArray().length - 1) {
            return;
        }
        this.animationDirection = 'left';
        this._changeDetectorRef.detectChanges();
        this.currentStepIndex++;
    }

    gotoPreviousStep(): void {
        if (this.currentStepIndex === 0) {
            return;
        }
        this.animationDirection = 'right';
        this._changeDetectorRef.detectChanges();
        this.currentStepIndex--;
    }


    toggleSidebar(name): void {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }

    openInformationDialog(success: boolean): void {
        this.informationDialogRef = this._matDialog.open(InformationDialogComponent, {
            disableClose: false
        });
        this.informationDialogRef.componentInstance.informationMessage =
            this._languageService.translate(`worker-complete-profile.actions.${success ? 'success' : 'failure'}`);
        this.informationDialogRef.componentInstance.iconName = success ? 'done' : 'error';
        this.informationDialogRef.afterClosed().subscribe(result => {
        });

    }

    completeProfile(): void {
        this._spinnerService.show();
        this._accountService.identity().then(identity => {
            this.completeProfileSteps.personalInformationStep.data.email = identity.email;
            this.completeProfileSteps.personalInformationStep.data.firstName = identity.firstName;
            this.completeProfileSteps.personalInformationStep.data.lastName = identity.lastName;
            this._completeProfileService.completeProfile(this.getCompletedWorkerProfile(), this.completeProfileSteps.personalInformationStep.data)
                .then(() => this.onCompleteProfileSuccess())
                .catch(() => this.onCompleteProfileFailure());
        });
    }

    isAuthenticated(){
        this._accountService.isAuthenticated();
    }

    isValid(){
        if(this.completeProfileSteps.servicesStep.data.length !==0 && this.completeProfileSteps.professionalInformationStep.isValid && this.completeProfileSteps.personalInformationStep.isValid)
        
        {
        return true;
        }
        else {
            return false;
        }
    }

    private isStepDisabled(stepIndex: number): boolean {
        return !this.getStepByIndex(stepIndex).isValid
            && stepIndex !== 0
            && !this.getStepByIndex(stepIndex - 1).isValid;
    }

    private getCompletedWorkerProfile(): WorkerProfileModel {
        const worker: WorkerProfileModel = new WorkerProfileModel({});
        worker.professionalInformation = this.completeProfileSteps.professionalInformationStep.data.toRequest();
        //worker.identityDocument = this.completeProfileSteps.identityDocumentStep.data.toRequest();
        worker.services = this.completeProfileSteps.servicesStep.data.map(service => service.toRequest());
        return worker;
    }

    private getCurrentStep(): CompleteProfileStep<any> {
        return this.getStepByIndex(this.currentStepIndex);
    }

    private getStepByIndex(stepIndex: number): CompleteProfileStep<any> {
        return this.completeProfileSteps.asArray()[stepIndex];
    }

    private onCompleteProfileSuccess(): void {
        this._spinnerService.hide();
        this._routeService.navigateToDashboard(this._accountService.getIdentity().id);
        this.openInformationDialog(true);
    }

    private onCompleteProfileFailure(): void {
        this._spinnerService.hide();
        this.openInformationDialog(false);
    }


    private configureLayout(): void {
        this._fuseConfigService.config = {
            layout: {
                navbar: {
                    hidden: true
                },
                toolbar: {
                    hidden: false,
                    position: 'above-fixed'
                },
                footer: {
                    hidden: false,
                },
                sidepanel: {
                    hidden: true
                }
            }
        };
    }
}

