import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    QueryList,
    ViewChildren,
    ViewEncapsulation,
    ViewChild
} from '@angular/core';
import { Subject } from 'rxjs';

import { fuseAnimations } from '@fuse/animations';
import { FusePerfectScrollbarDirective } from '@fuse/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { FuseConfigService } from '../../../../@fuse/services/config.service';
import { WorkerProfileModel } from '../worker-profile.model';
import {
    PersonalInformation,
    WorkerPersonalInformationFormStatus
} from '../../components/worker/worker-form/worker-personel-information-form/worker-personal-information.model';
import { WorkerProfessionalInformationFormStatus } from '../../components/worker/worker-form/worker-professional-information-form/worker-professional-information.model';
import { WorkerServicesStatus, WorkerServiceModel } from '../../components/worker/worker-services/worker-service.model';
import { CompleteProfileStep } from './cmplete-profile-step.model';
import { CompleteProfileBeforeLoginService } from './complete-profile.service';
import { AccountService, LanguageService, SpinnerService, PhoneValidator, Account, LoginService, UserService, PHONE_ALREADY_USED_TYPE, EMAIL_ALREADY_USED_TYPE, PHONE_NOT_FOUND_TYPE, INCORRECT_PASSWORD_TYPE, EventService, DateUtils, RouteService, CompareUtils } from '../../../core';
import { MatDialog, MatDialogRef, MatSnackBar, MatSelectChange } from '@angular/material';
import { InformationDialogComponent } from '../../components/information-dialog/information-dialog.component';
import { CompleteProfileSteps } from './complete-profile-steps.model';
import { takeUntil } from 'rxjs/operators';
import { CompleteProfileBeforeLoginResolver } from './complete-profile.resolver';
import { StorageService } from 'app/core/storage/storage.service';
import { Meta } from '@angular/platform-browser';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { RegisterService } from 'app/main/shared/authentication/register/register.service';
import { googleAdsInscriptionFinalized, facebookPixelInscriptionFinalized } from 'assets/script';
import { UserGenderTypeService } from 'app/main/referential/user/gender/user-gender-type.service';
import { UserGenderType } from 'app/main/referential/user/gender/user-gender-type.model';
import { ProfileImageCropperDialogComponent } from 'app/main/components/image/profile-image-croque/profile-image-cropper-dialog.component';
import { RegisterFormFieldsEnum } from 'app/main/shared/authentication/register/register.model';
import { HttpErrorResponse } from '@angular/common/http';
import { MatAccordion } from '@angular/material/expansion';
import { WorkType } from 'app/main/referential/work/type/work-type.model';
import { WorkTypeService } from 'app/main/referential/work/type/work-type.service';
import { WorkServiceType } from 'app/main/referential/work/service/work-service-type.model';
import { WorkServiceService } from 'app/main/referential/work/service/work-service.service';
import { WorkerTrainingType } from 'app/main/referential/worker/training/worker-training-type.model';
import { WorkerTrainingTypeService } from 'app/main/referential/worker/training/worker-training-type.service';
import { WorkerEquipmentType } from 'app/main/referential/worker/equipment/worker-equipment-type.model';
import { WorkerEquipmentTypeService } from 'app/main/referential/worker/equipment/worker-equipment-type.service';

@Component({
    selector: 'academy-course-before-login',
    templateUrl: './complete-profile.component.html',
    styleUrls: ['./complete-profile.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})

export class CompleteProfileBeforeLoginComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild(MatAccordion) accordion: MatAccordion;
    animationDirection: 'left' | 'right' | 'none';
    completeProfileSteps: CompleteProfileSteps;
    courseStepContent: any;
    worker: WorkerProfileModel;
    currentStepIndex: number;
    workTypes: Array<WorkType>;
    genders: Array<UserGenderType>;
    HOURLY = 'HOURLY';
    selectedServiceCodes: Array<String>;
    selectedWorkType = false;
    formService: FormGroup;
    workerService: WorkerServiceModel;
    registerForm: FormGroup;
    informationDialogRef: MatDialogRef<InformationDialogComponent>;
    @ViewChildren(FusePerfectScrollbarDirective)
    fuseScrollbarDirectives: QueryList<FusePerfectScrollbarDirective>;
    form: FormGroup;
    compareByCode: any = CompareUtils.compareByCode;
    workServiceTypes: Array<WorkServiceType>;
    personalInformations: any;
    trainingTypes: Array<WorkerTrainingType>;
    step = 0;
    account: Account;
    isChecked = false;
    maxBirthday = DateUtils.currentDateMinusYears(18);
    minBirthday = DateUtils.currentDateMinusYears(90);
    private _unsubscribeAll: Subject<any>;
    finalService: WorkerServiceModel;
    services: Array<WorkerServiceModel> = new Array<WorkerServiceModel>();
    equipmentTypes: Array<WorkerEquipmentType>;

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseSidebarService: FuseSidebarService,
        private _fuseConfigService: FuseConfigService,
        private _completeProfileService: CompleteProfileBeforeLoginService,
        private _accountService: AccountService,
        private _spinnerService: SpinnerService,
        private _userService: UserService,
        private _matDialog: MatDialog,
        private _languageService: LanguageService,
        private _workerEquipmentTypeService: WorkerEquipmentTypeService,
        private _trainingTypeService: WorkerTrainingTypeService,
        private _workTypeService: WorkTypeService,
        private registerService: RegisterService,
        private spinnerService: SpinnerService,
        private _routeService: RouteService,
        private meta: Meta,
        private _storageService: StorageService,
        private loginService: LoginService,
        private formBuilder: FormBuilder,
        private eventManager: EventService,
        private _matSnackBar: MatSnackBar,
        private _workServiceService: WorkServiceService,
        private _genderTypeService: UserGenderTypeService,
        private _workerCompleteProfileResolver: CompleteProfileBeforeLoginResolver) {
        this.animationDirection = 'none';
        this.currentStepIndex = 0;
        this._unsubscribeAll = new Subject();
        this.configureLayout();
    }

    ngOnInit(): void {
        this.isAuthenticated();
        this.initWorkTypes();
        this.initTrainingTypes();
        this.initEquipmentsTypes();
        this.buildForm();
        this.buildFormService();
        this.generateTags();
        this.initGenders();
        this._workServiceService.getAll((workServiceTypes) => {
            this.workServiceTypes = workServiceTypes;
        })
        this.completeProfileSteps = new CompleteProfileSteps();
        this._workerCompleteProfileResolver.onPersonalInformationChange
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(identity => {
                if(identity){
                    this.completeProfileSteps.personalInformationStep.data = new PersonalInformation(identity);
                }
            });
    }


    private createWorkerServiceForm(): WorkerServiceModel {
        return new WorkerServiceModel({
            "workType": this.getChildFormServiceValue('workType'),
            "workServiceType": new Array(this.getChildFormServiceValue('workServiceType')),
            "training": this.getChildFormServiceValue('training'),
            "equipment": this.getChildFormServiceValue('equipment'),
            "remuneration": this.getChildFormServiceValue('remuneration')
        });
    }


    private buildFormService(): void {
        this.formService = this.formBuilder.group({
            workType: ["",],
            workServiceType: [""],
            training: [, [Validators.required]],
            equipment: [, [Validators.required]],
            remuneration: this.formBuilder.group({
                type: new FormControl({
                    value: new FormArray([]),
                })
            }),
        });
    }

    private getChildFormServiceValue(formControlName: string): any {
        return this.formService.get(formControlName).value;
    }

    private initWorkTypes(): void {
        this._workTypeService.getAllWithServices().then((workTypes: Array<WorkType>) => {
            this.workTypes = workTypes;
        });
    }

    private initEquipmentsTypes(): void {
        this._workerEquipmentTypeService.getAll().then((equipmentTypes: Array<WorkerEquipmentType>) => {
            this.equipmentTypes = equipmentTypes;

        });
    }

    loadWorkServiceTypes(matSelectChangeEvent: MatSelectChange): void {
        this.loadWorkServiceTypesByWorkerTypeCode(matSelectChangeEvent.value.code);
        this.selectedWorkType = true;
    }

    isSelectedWorkType() {
        if (this.selectedWorkType == true) {
            return true;
        } else {
            return false;
        }
    }

    cropImage(imageChangedEvent: Event): void {
        this._matDialog.open(ProfileImageCropperDialogComponent, {
            panelClass: ProfileImageCropperDialogComponent.IMAGE_CROPPER_DIALOG_PANEL_CLASS,
            data: {
                imageChangedEvent: imageChangedEvent
            }
        }).afterClosed().subscribe(response => {
            if (!response) {
                return;
            }
            this.form.patchValue({ image: response[0] });
        });
    }

    setStep(index: number) {
        this.step = index;
    }

    nextStep() {
        this.step++;
    }

    prevStep() {
        this.step--;
    }


    ngAfterViewInit(): void {
        this.courseStepContent = this.fuseScrollbarDirectives.find((fuseScrollbarDirective) => {
            return fuseScrollbarDirective.elementRef.nativeElement.id === 'workerService-step-content';
        });
    }

    generateTags() {
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

    private buildForm(): void {
        this.form = this.formBuilder.group({
            firstName: ["", [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
            lastName: ["", [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
            email: ["", [Validators.required, Validators.email, Validators.maxLength(191)]],
            phone: [, [Validators.required, PhoneValidator.validCanadaPhone()]],
            gender: ["", [Validators.required]],
            birthday: [, [Validators.required]],
            image: ["assets/images/avatars/profile.jpg"]
        });
    }

    private buildAccount(): Account {
        return new Account({
            'firstName': this.getStep1ChildValue(RegisterFormFieldsEnum.FIRST_NAME),
            'lastName': this.getStep1ChildValue(RegisterFormFieldsEnum.LAST_NAME),
            'email': this.getStep1ChildValue(RegisterFormFieldsEnum.EMAIL),
            'phone': this.getStep1ChildValue(RegisterFormFieldsEnum.PHONE),
            'image': this.getStep1ChildValue(RegisterFormFieldsEnum.IMAGE),
            'birthday': this.getStep1ChildValue(RegisterFormFieldsEnum.BIRTHDAY),
            'gender': this.getStep1ChildValue(RegisterFormFieldsEnum.GENDER),
            'langKey': this._languageService.getCurrent()
        });
    }




    private loadWorkServiceTypesByWorkerTypeCode(workTypeCode: string): void {
        this._workServiceService.getByWorkTypeCode(workTypeCode).then((workServiceTypes: Array<WorkServiceType>) => {
            this.workServiceTypes = workServiceTypes;
        });
    }

    private getStep1ChildValue(formControlName: string): any {
        return this.form.get(formControlName).value;
    }

    private initGenders(): void {
        this._genderTypeService.getAll().then((genders: Array<UserGenderType>) => {
            this.genders = genders;
        }
        );
    }

    navigateToLoginPage(): void {
        this._routeService.navigateToLoginPage();
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

    register(): void {
        this.spinnerService.show();
        const account: Account = this.buildAccount();
        const credentials = {
            phone: account.phone,
            email: account.email,
            code: account.code,
            rememberMe: true
        };
        account.authorities.push("ROLE_WORKER");

        this.registerService.completeProfileRegister(account).subscribe(
            (account) => {

                this._userService.getByEmail(credentials.email).subscribe((data) => {
                    const CredentialsAuthentication = {
                        phone: data.phone,
                        code: data.code,
                        rememberMe: true
                    };
                    this.login(CredentialsAuthentication);
                })

                googleAdsInscriptionFinalized();
                facebookPixelInscriptionFinalized();
                this.spinnerService.hide();
            },
            response => {
                this.spinnerService.hide();
                return this.processError(response);
            }
        );

    }

    processLoginError(response: HttpErrorResponse): void {
        if (response.status !== 400) {
            return;
        }
        if (response.error.type === PHONE_NOT_FOUND_TYPE) {
            this.form.controls['phone'].setErrors({ 'notFound': true });
        } else if (response.error.type === INCORRECT_PASSWORD_TYPE) {
            this.form.controls['code'].setErrors({ 'incorrect': true });
        }
    }

    private processError(response: HttpErrorResponse): void {
        if (response.status !== 400) {
            return;
        }
        if (response.error.type === EMAIL_ALREADY_USED_TYPE) {
            this.form.controls[RegisterFormFieldsEnum.EMAIL].setErrors({ 'alreadyUsed': true });
        } else if (response.error.type === PHONE_ALREADY_USED_TYPE) {
            this.form.controls[RegisterFormFieldsEnum.PHONE].setErrors({ 'alreadyUsed': true });
        }
    }

    login(credentials): void {
        this.spinnerService.show();
        this.loginService.loginWithPhone(credentials)
            .then((account: Account) => {
                this.spinnerService.hide();
                this.eventManager.broadcast({
                    name: 'authenticationSuccess',
                    content: 'Sending Authentication Success'
                });
                this._completeProfileService.completeMinimalProfileWorker(this._storageService.getServicesAndProfessionelInformations())
                    .then(() => {
                        this.onCompleteProfileSuccess();
                        this._storageService.removeServicesAndProfessionelInformations();
                    })
                    .catch(() => this.onCompleteProfileFailure());

            }).catch((e) => {
                this.processLoginError(e);
                this.spinnerService.hide();
            });
    }

    saveProfile(): void {

        if (this.form.invalid || !this.isValid()) {
            this._matSnackBar.open("Veuillez comptétez vos informations s'il vous plais", "OK", {
                verticalPosition: "top",
                duration: 2000,
            });
        }
        else {
            this._storageService.putServicesAndProfessionelInformations(this.getCompletedWorkerProfile());
            this.register();
        }



    }

    isAuthenticated() {
        if (this._accountService.isAuthenticated) {
            return true;
        }

        else {
            return false;
        }
    }

    isValid() {
        if (this.services.length !== 0 && this.completeProfileSteps.professionalInformationStep.isValid) {
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

        worker.services = this.services.map((services) => services.toMinimalRequest());
        return worker;
    }

    private getCurrentStep(): CompleteProfileStep<any> {
        return this.getStepByIndex(this.currentStepIndex);
    }

    private initTrainingTypes(): void {
        this._trainingTypeService.getAll().then((trainingTypes: Array<WorkerTrainingType>) => {
            this.trainingTypes = trainingTypes;
        });
    }

    toggle(event: any) {
        this.formService.get('training').patchValue(this.trainingTypes[0]);
        this.formService.get('equipment').patchValue(this.equipmentTypes[1]);
        this.formService.get('remuneration.type').patchValue("HOURLY");
        if (event.checked) {
            this._workServiceService.getByWorkTypeCode(event.source.value.code).then((workServiceTypes) => {
                workServiceTypes.forEach((workServiceType) => {
                    this.finalService = this.createWorkerServiceForm();
                    this.finalService.workType = event.source.value;
                    this.finalService.workServiceType = workServiceType;
                    this.services.push(this.finalService);
                })
            });
        }

        else {
            this.services = this.services.filter((service) => {
                return service.workType.code !== event.source.value.code;
            });
        }
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

