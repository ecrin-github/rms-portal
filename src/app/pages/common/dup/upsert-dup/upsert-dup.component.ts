import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { DupInterface } from 'src/app/_rms/interfaces/dup/dup.interface';
import { DtpService } from 'src/app/_rms/services/entities/dtp/dtp.service';
import { DupService } from 'src/app/_rms/services/entities/dup/dup.service';
import KTWizard from '../../../../../assets/js/components/wizard'
import { CommonModalComponent } from '../../common-modal/common-modal.component';

@Component({
  selector: 'app-upsert-dup',
  templateUrl: './upsert-dup.component.html',
  styleUrls: ['./upsert-dup.component.scss']
})
export class UpsertDupComponent implements OnInit {
  form: FormGroup;
  isEdit: boolean = false;
  isView: boolean = false;
  organizationList:[] = [];
  statusList:[] = [];
  id: any;
  dupData: DupInterface;
  @ViewChild('wizard', { static: true }) el: ElementRef;
  wizard: any;
  currentStatus: number = 2;
  associatedStudies = [];
  todayDate: any;
  submitted: boolean = false;
  nextStep: number;
  buttonClick: any;

  constructor( private router: Router, private fb: FormBuilder, private dupService: DupService, private spinner: NgxSpinnerService, private toastr: ToastrService,
    private activatedRoute: ActivatedRoute, private dtpService: DtpService, private modalService: NgbModal) { 
      this.form = this.fb.group({
        orgId: ['', Validators.required],
        displayName: ['', Validators.required],
        statusId: '',
        initialContactDate: null,
        setUpCompleted: null,
        prereqsMet: null,
        duaAgreedDate: null,
        availabilityRequested: null,
        availabilityConfirmed: null,
        accessConfirmed: null,
      })
    }

  ngOnInit(): void {
    const todayDate = new Date();
    this.todayDate = {year: todayDate.getFullYear(), month: todayDate.getMonth()+1, day: todayDate.getDate()};
    this.isEdit = this.router.url.includes('edit') ? true : false;
    this.isView = this.router.url.includes('view') ? true : false;
    if(this.isEdit || this.isView) {
      this.id = this.activatedRoute.snapshot.params.id;
      this.getDupById(this.id);
    }
    this.getOrganization();
    this.getStatus();
    if (this.router.url.includes('add')) {
      this.form.patchValue({
        initialContactDate: this.todayDate
      })
    }
  }
  ngAfterViewInit() {
    this.wizard = new KTWizard(this.el.nativeElement, {
      startStep: 2,
      clickableSteps: false,
      navigation: true
    });
    this.wizard.on('change', (wizardObj) => {
      this.nextStep = this.buttonClick === 'next' ? wizardObj.getStep() + 1 : wizardObj.getStep() -1;
      if (!this.isView && this.buttonClick === 'next') {
        if (this.nextStep - 1 === 1) {
          if (this.form.value.initialContactDate === null || this.form.value.initialContactDate === '') {
            this.wizard.stop();
            this.toastr.error('Complete all the fields to go to the next phase');
          }
        }
        if (this.nextStep - 1 === 2) {
          if (this.form.value.setUpCompleted === null || this.form.value.setUpCompleted === '') {
            this.wizard.stop();
            this.toastr.error('Complete all the fields to go to the next phase');
          }
        }
        if (this.nextStep - 1 === 3) {
          if (this.form.value.prereqsMet === null || this.form.value.prereqsMet === '' || this.form.value.duaAgreedDate === null || this.form.value.duaAgreedDate === '') {
            this.wizard.stop();
            this.toastr.error('Complete all the fields to go to the next phase');
          }
        }
        if (this.nextStep - 1 === 4) {
          if (this.form.value.availabilityRequested === null || this.form.value.availabilityRequested === '' || this.form.value.availabilityConfirmed === null || this.form.value.availabilityConfirmed === '') {
            this.wizard.stop();
            this.toastr.error('Complete all the fields to go to the next phase');
          }
        }
      }
    })
  }

  get g() { return this.form.controls; }

  getOrganization() {
    this.spinner.show();
    this.dtpService.getOrganizationList().subscribe((res: any) => {
      this.spinner.hide();
      if (res && res.data) {
        this.organizationList = res.data;
      }
    }, error => {
      this.spinner.hide();
      this.toastr.error(error.error.title);
    })
  }
  getStatus() {
    setTimeout(() => {
     this.spinner.show(); 
    });
    this.dupService.getStatusList().subscribe((res: any) => {
      this.spinner.hide();
      if (res && res.data) {
        this.statusList = res.data;
        const arr: any = this.statusList.filter((item: any) => item.name === 'Set up');
        if (arr && arr.length) {
          this.form.patchValue({
            statusId: arr[0].id
          })
        }
      }
    }, error => {
      this.spinner.hide();
      this.toastr.error(error.error.title);
    })
  }
  dateToString(date) {
    if (date) {
      const dateString =  date.year + '-' + date.month + '-' + date.day;
      return new Date(dateString).toISOString();
    } else {
      return null
    }
  }
  stringTodate(date) {
    const dateArray = new Date(date);
    return date ? { year: dateArray.getFullYear(), month: dateArray. getMonth()+1, day: dateArray. getDate()+1} : null;
  }
  viewDate(date) {
    const dateArray = new Date(date);
    return date ? dateArray.getFullYear() + '/' + (dateArray.getMonth()+1) + '/' + (dateArray.getDate()+1) : '';
  }
  onSave() {
    if (localStorage.getItem('updateDupList')) {
      localStorage.removeItem('updateDupList');
    }
    const payload = JSON.parse(JSON.stringify(this.form.value));
    payload.initialContactDate = this.dateToString(payload.initialContactDate);
    payload.setUpCompleted = this.dateToString(payload.setUpCompleted);
    payload.prereqsMet = this.dateToString(payload.prereqsMet);
    payload.duaAgreedDate = this.dateToString(payload.duaAgreedDate);
    payload.availabilityRequested = this.dateToString(payload.availabilityRequested);
    payload.availabilityConfirmed = this.dateToString(payload.availabilityConfirmed);
    payload.accessConfirmed = this.dateToString(payload.accessConfirmed);
    payload.statusId = this.wizard.getStep() === 1 ? this.getStatusByName('creation') : this.wizard.getStep() === 2 ? this.getStatusByName('set up') : this.wizard.getStep() === 3 ? this.getStatusByName('preparation') : this.wizard.getStep() === 4 ? this.getStatusByName('transfer') : this.wizard.getStep() === 5 ? this.getStatusByName('complete') : this.getStatusByName('creation');
    if (this.wizard.getStep() === 1) {
      this.form.controls['initialContactDate'].setValidators(Validators.required);
      this.form.controls['initialContactDate'].updateValueAndValidity();
    }
    if (this.wizard.getStep() === 2) {
      this.form.controls['initialContactDate'].setValidators(Validators.required);
      this.form.controls['setUpCompleted'].setValidators(Validators.required);
      this.form.controls['initialContactDate'].updateValueAndValidity();
      this.form.controls['setUpCompleted'].updateValueAndValidity();
    }
    if (this.wizard.getStep() === 3) {
      this.form.controls['initialContactDate'].setValidators(Validators.required);
      this.form.controls['setUpCompleted'].setValidators(Validators.required);
      this.form.controls['prereqsMet'].setValidators(Validators.required);
      this.form.controls['duaAgreedDate'].setValidators(Validators.required);
      this.form.controls['initialContactDate'].updateValueAndValidity();
      this.form.controls['setUpCompleted'].updateValueAndValidity();
      this.form.controls['prereqsMet'].updateValueAndValidity();
      this.form.controls['duaAgreedDate'].updateValueAndValidity();
    }
    if (this.wizard.getStep() === 4) {
      this.form.controls['initialContactDate'].setValidators(Validators.required);
      this.form.controls['setUpCompleted'].setValidators(Validators.required);
      this.form.controls['prereqsMet'].setValidators(Validators.required);
      this.form.controls['duaAgreedDate'].setValidators(Validators.required);
      this.form.controls['availabilityRequested'].setValidators(Validators.required);
      this.form.controls['availabilityConfirmed'].setValidators(Validators.required);
      this.form.controls['initialContactDate'].updateValueAndValidity();
      this.form.controls['setUpCompleted'].updateValueAndValidity();
      this.form.controls['prereqsMet'].updateValueAndValidity();
      this.form.controls['duaAgreedDate'].updateValueAndValidity();
      this.form.controls['availabilityRequested'].updateValueAndValidity();
      this.form.controls['availabilityConfirmed'].updateValueAndValidity();
    }
    if (this.wizard.getStep() === 5) {
      this.form.controls['initialContactDate'].setValidators(Validators.required);
      this.form.controls['setUpCompleted'].setValidators(Validators.required);
      this.form.controls['prereqsMet'].setValidators(Validators.required);
      this.form.controls['duaAgreedDate'].setValidators(Validators.required);
      this.form.controls['availabilityRequested'].setValidators(Validators.required);
      this.form.controls['availabilityConfirmed'].setValidators(Validators.required);
      this.form.controls['accessConfirmed'].setValidators(Validators.required);
      this.form.controls['initialContactDate'].updateValueAndValidity();
      this.form.controls['setUpCompleted'].updateValueAndValidity();
      this.form.controls['prereqsMet'].updateValueAndValidity();
      this.form.controls['duaAgreedDate'].updateValueAndValidity();
      this.form.controls['availabilityRequested'].updateValueAndValidity();
      this.form.controls['availabilityConfirmed'].updateValueAndValidity();
      this.form.controls['accessConfirmed'].updateValueAndValidity();
    }
    if (payload.initialContactDate > payload.setUpCompleted) {
      this.toastr.error('Initial Contact Date cannot be greater than Set Up Completed date');
      return;
    }
    if (payload.setUpCompleted > payload.prereqsMet) {
      this.toastr.error('Set Up Completed date cannot be greater than PreRequest Met date');
      return;
    }
    if (payload.prereqsMet > payload.duaAgreedDate) {
      this.toastr.error('Prereqs Met date cannot be greater than DUA Agreed date');
      return;
    }
    if (payload.duaAgreedDate > payload.availabilityRequested) {
      this.toastr.error('DUA Agreed date cannot be greater than Availability Requested date');
      return;
    }
    if (payload.availabilityRequested > payload.availabilityConfirmed) {
      this.toastr.error('Availability Reuested date cannot be greater than Availability Confirmed');
      return;
    }
    if (payload.availabilityConfirmed > payload.accessConfirmed) {
      this.toastr.error('Availability Confirmed date cannot be greater than Access Confirmed date');
      return;
    }
    this.submitted = true;
    if (this.form.valid) {
      if (this.isEdit) {
        payload.id = this.id;
        this.spinner.show();
        this.dupService.editDup(this.id, payload).subscribe((res: any) => {
          this.spinner.hide();
          if (res.statusCode === 200) {
            this.toastr.success('DUP updated successfully');
            localStorage.setItem('updateDupList', 'true');
            this.getDupById(this.id);
          } else {
            this.toastr.error(res.messages[0]);
          }
        }, error => {
          this.spinner.hide();
          this.toastr.error(error.error.title);
        })
      } else {
        this.spinner.show();
        this.dupService.addDup(payload).subscribe((res: any) => {
          this.spinner.hide();
          if (res.statusCode === 200) {
            this.toastr.success('DUP added successfully');
            localStorage.setItem('updateDupList', 'true');
            setTimeout(() => {
              window.close();
            }, 1000);
          } else {
            this.toastr.error(res.messages[0]);
          }
        }, error => {
          this.spinner.hide();
          this.toastr.error(error.error.title);
        })
      }
    }
  }
  getStatusByName(name) {
    const arr: any = this.statusList.filter((item: any) => item.name.toLowerCase() === name);
    return arr[0].id;
  }
  getDupById(id) {
    setTimeout(() => {
     this.spinner.show(); 
    });
    this.dupService.getDupById(id).subscribe((res: any) => {
      this.spinner.hide();
      if (res && res.data) {
        this.dupData = res.data[0];
        this.patchForm(this.dupData);
      }
    }, error => {
      this.spinner.hide();
      this.toastr.error(error.error.title);
    })
  }
  patchForm(data) {
    this.form.patchValue({
      orgId: data.orgId,
      displayName: data.displayName,
      statusId: data.statusId,
      initialContactDate: this.stringTodate(data.initialContactDate),
      setUpCompleted: this.stringTodate(data.setUpCompleted),
      prereqsMet: this.stringTodate(data.prereqsMet),
      duaAgreedDate: this.stringTodate(data.duaAgreedDate),
      availabilityRequested: this.stringTodate(data.availabilityRequested),
      availabilityConfirmed: this.stringTodate(data.availabilityConfirmed),
      accessConfirmed: this.stringTodate(data.accessConfirmed),
    });
    const arr: any = this.statusList.filter((item: any) => item.id === this.dupData.statusId);
    if (arr && arr.length) {
      this.currentStatus = arr[0].name.toLowerCase() === 'creation' ? 1 : arr[0].name.toLowerCase() === 'set up' ? 2 : arr[0].name.toLowerCase() === 'preparation' ? 3 : arr[0].name.toLowerCase() === 'transfer' ? 4 : arr[0].name.toLowerCase() === 'complete' ? 5 : 1;
      this.wizard.goTo(this.currentStatus);
    }
  }
  findOrganization(id) {
    const organizationArray: any = this.organizationList.filter((type: any) => type.id === id);
    return organizationArray && organizationArray.length ? organizationArray[0].defaultName : ''
  }
  findStatus(id) {
    const statusArray: any = this.statusList.filter((type: any) => type.id === id);
    return statusArray && statusArray.length ? statusArray[0].name : '';
  }
  close() {
    window.close();
  }
  addStudy() {
    const studyModal = this.modalService.open(CommonModalComponent, { size: 'xl', backdrop: 'static' });
    studyModal.componentInstance.title = 'Add Study';
    studyModal.componentInstance.type = 'study';
    studyModal.result.then((data) => {
      if (data) {
        this.associatedStudies = data;
      }
    }, error => {});
  }
  removeStudy(index) {
    this.associatedStudies.splice(index, 1);
  }
  addDataObject() {
    const dataModal = this.modalService.open(CommonModalComponent, {size: 'xl', backdrop: 'static'});
    dataModal.componentInstance.title = 'Add Data Object';
    dataModal.componentInstance.type = 'dataObject';
  }
  addUser() {
    const userModal = this.modalService.open(CommonModalComponent, {size: 'xl', backdrop: 'static'});
    userModal.componentInstance.title = 'Add User';
    userModal.componentInstance.type = 'user';
  }
}
