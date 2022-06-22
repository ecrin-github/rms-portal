import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDate, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { DtpInterface } from 'src/app/_rms/interfaces/dtp/dtp.interface';
import { DtpService } from 'src/app/_rms/services/entities/dtp/dtp.service';
import KTWizard from '../../../../../assets/js/components/wizard'
import { CommonModalComponent } from '../../common-modal/common-modal.component';

@Component({
  selector: 'app-upsert-dtp',
  templateUrl: './upsert-dtp.component.html',
  styleUrls: ['./upsert-dtp.component.scss']
})
export class UpsertDtpComponent implements OnInit {
  form: FormGroup;
  isEdit: boolean = false;
  isView: boolean = false;
  organizationList:[] = [];
  statusList:[] = [];
  id: any;
  dtpData: DtpInterface;
  @ViewChild('wizard', { static: true }) el: ElementRef;
  wizard: any;
  currentStatus: number = 2;
  associatedStudies = [];
  todayDate: any;
  submitted:boolean = false;
  nextStep: number;
  buttonClick: any;

  constructor( private router: Router, private fb: FormBuilder, private dtpService: DtpService, private spinner: NgxSpinnerService, private toastr: ToastrService,
    private activatedRoute: ActivatedRoute, private modalService: NgbModal) { 
    this.form = this.fb.group({
      orgId: ['', Validators.required],
      displayName: ['', Validators.required],
      statusId: '',
      initialContactDate: null,
      setUpCompleted: null,
      mdAccessGranted: null,
      mdCompleteDate: null,
      dtaAgreedDate: null,
      uploadAccessRequested: null,
      uploadAccessConfirmed: null,
      uploadsComplete: null,
      qcChecksCompleted: null,
      mdIntegratedWithMdr: null,
      availabilityRequested: null,
      availabilityConfirmed: null,
    })
  }

  ngOnInit(): void {
    const todayDate = new Date();
    this.todayDate = {year: todayDate.getFullYear(), month: todayDate.getMonth()+1, day: todayDate.getDate()};
    this.getOrganization();
    this.getStatus();
    this.isEdit = this.router.url.includes('edit') ? true : false;
    this.isView = this.router.url.includes('view') ? true : false;
    if (this.isEdit || this.isView) {
      this.id = this.activatedRoute.snapshot.params.id;
      this.getDtpById(this.id);
    }
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
      navigation:true
    });
    this.wizard.on('change', (wizardObj) => {
      this.nextStep = this.buttonClick === 'next' ? wizardObj.getStep() + 1 : wizardObj.getStep() - 1;
      if (!this.isView && this.buttonClick === 'next') {
        if (this.nextStep - 1 === 1) {
          if (this.form.value.initialContactDate === null || this.form.value.initialContactDate === '') {
            this.wizard.stop();
            this.toastr.error('Complete all the fields to go to the next phase')
          }
        }
        if (this.nextStep - 1 === 2) {
          if (this.form.value.setUpCompleted === null || this.form.value.setUpCompleted === '') {
            this.wizard.stop();
            this.toastr.error('Complete all the fields to go to the next phase')
          }
        }
        if (this.nextStep - 1 === 3) {
          if (this.form.value.mdAccessGranted === null || this.form.value.mdAccessGranted === '' || this.form.value.mdCompleteDate === null || this.form.value.mdCompleteDate === '') {
            this.wizard.stop();
            this.toastr.error('Complete all the fields to go to the next phase')
          }
        }
        if (this.nextStep - 1 === 4) {
          if (this.form.value.dtaAgreedDate === null || this.form.value.dtaAgreedDate === '' || this.form.value.uploadAccessRequested === null || this.form.value.uploadAccessRequested === '' ||
            this.form.value.uploadAccessConfirmed === null || this.form.value.uploadAccessConfirmed === '' || this.form.value.uploadsComplete === null || this.form.value.uploadsComplete === '') {
            this.wizard.stop();
            this.toastr.error('Complete all the fields to go to the next phase')
          }
        }
        if (this.nextStep - 1 === 5) {
          if (this.form.value.qcChecksCompleted === null || this.form.value.qcChecksCompleted === '' || this.form.value.mdIntegratedWithMdr === null || this.form.value.mdIntegratedWithMdr === ''
            || this.form.value.availabilityRequested === '' || this.form.value.availabilityRequested === null) {
            this.wizard.stop();
            this.toastr.error('Complete all the fields to go to the next phase')
          }
        }
      }
    });
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
    this.dtpService.getStatusList().subscribe((res: any) => {
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
    if (localStorage.getItem('updateDtpList')) {
      localStorage.removeItem('updateDtpList');
    }
    const payload = JSON.parse(JSON.stringify(this.form.value));
    payload.initialContactDate = this.dateToString(payload.initialContactDate);
    payload.setUpCompleted = this.dateToString(payload.setUpCompleted);
    payload.mdAccessGranted = this.dateToString(payload.mdAccessGranted);
    payload.mdCompleteDate = this.dateToString(payload.mdCompleteDate);
    payload.dtaAgreedDate = this.dateToString(payload.dtaAgreedDate);
    payload.uploadAccessRequested = this.dateToString(payload.uploadAccessRequested);
    payload.uploadAccessConfirmed = this.dateToString(payload.uploadAccessConfirmed);
    payload.uploadsComplete = this.dateToString(payload.uploadsComplete);
    payload.qcChecksCompleted = this.dateToString(payload.qcChecksCompleted);
    payload.mdIntegratedWithMdr = this.dateToString(payload.mdIntegratedWithMdr);
    payload.availabilityRequested = this.dateToString(payload.availabilityRequested);
    payload.availabilityConfirmed = this.dateToString(payload.availabilityConfirmed);
    payload.statusId = this.wizard.getStep() === 1 ? this.getStatusByName('creation') : this.wizard.getStep() === 2 ? this.getStatusByName('set up') : this.wizard.getStep() === 3 ? this.getStatusByName('preparation') : this.wizard.getStep() === 4 ? this.getStatusByName('transfer') : this.wizard.getStep() === 5 ? this.getStatusByName('checking') : this.wizard.getStep() === 6 ? this.getStatusByName('complete') : this.getStatusByName('creation');
    if (payload.initialContactDate > payload.setUpCompleted) {
      this.toastr.error('Initial contact date cannot be greater than Set Up completed date. Dates entered in one phase should not normally be before dtes in an earlier phase');
      return
    }
    if (payload.setUpCompleted > payload.mdAccessGranted) {
      this.toastr.error('set Up completed date cannot be greater than MD Access Granted date. Dates entered in one phase should not normally be before dtes in an earlier phase');
      return
    }
    if (payload.mdAccessGranted > payload.mdCompleteDate) {
      this.toastr.error('MD Access Granted date cannot be greater than MD Completed date. Dates entered in one phase should not normally be before dtes in an earlier phase');
      return
    }
    if (payload.mdCompleteDate > payload.dtaAgreedDate) {
      this.toastr.error('MD Completed date cannot be greater than DTA agreed date. Dates entered in one phase should not normally be before dtes in an earlier phase');
      return
    }
    if (payload.dtaAgreedDate > payload.uploadAccessRequested) {
      this.toastr.error('DTA Agreed date cannot be greater than Upload Access Requested date. Dates entered in one phase should not normally be before dtes in an earlier phase');
      return
    }
    if (payload.uploadAccessRequested > payload.uploadAccessConfirmed) {
      this.toastr.error('Upload Access Requested date cannot be greater than Upload Access Confirmed date. Dates entered in one phase should not normally be before dtes in an earlier phase');
      return
    }
    if (payload.uploadAccessConfirmed > payload.uploadsComplete) {
      this.toastr.error('Upload Confirmed date cannot be greater than Upload Completed date. Dates entered in one phase should not normally be before dtes in an earlier phase');
      return
    }
    if (payload.uploadsComplete > payload.qcChecksCompleted) {
      this.toastr.error('Upload completed date cannot be greater than QC Checks Completed date. Dates entered in one phase should not normally be before dtes in an earlier phase');
      return
    }
    if (payload.qcChecksCompleted > payload.mdIntegratedWithMdr) {
      this.toastr.error('QC Checks completed date cannot be greater than MD integrated with MDR date. Dates entered in one phase should not normally be before dtes in an earlier phase');
      return
    }
    if (payload.mdIntegratedWithMdr > payload.availabilityRequested) {
      this.toastr.error('MD integrated with MDR date cannot be greater than availability requested date. Dates entered in one phase should not normally be before dtes in an earlier phase');
      return
    }
    if (payload.availabilityRequested > payload.availabilityConfirmed) {
      this.toastr.error('Availability Reuested date cannot be greater than Availability Confirmed date. Dates entered in one phase should not normally be before dtes in an earlier phase');
      return
    }
    this.submitted = true;
    if (this.form.valid) {
      if (this.isEdit) {
        this.spinner.show();
        payload.id = this.id;
        this.dtpService.editDtp(this.id, payload).subscribe((res: any) => {
          this.spinner.hide();
          if (res.statusCode === 200) {
            this.toastr.success('DTP updated successfully');
            localStorage.setItem('updateDtpList', 'true');
            this.getDtpById(this.id);
          } else {
            this.toastr.error(res.messages[0]);
          }
        }, error => {
          this.spinner.hide();
          this.toastr.error(error.error.title);
        })

      } else {
        this.spinner.show();
        this.dtpService.addDtp(payload).subscribe((res: any) => {
          this.spinner.hide();
          if (res.statusCode === 200) {
            this.toastr.success('DTP added successfully');
            localStorage.setItem('updateDtpList', 'true');
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
  getDtpById(id) {
    setTimeout(() => {
     this.spinner.show();; 
    });
    this.dtpService.getDtpById(id).subscribe((res: any) => {
      this.spinner.hide();
      if (res && res.data) {
        this.dtpData = res.data[0];
        this.patchForm(this.dtpData);
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
      mdAccessGranted: this.stringTodate(data.mdAccessGranted),
      mdCompleteDate: this.stringTodate(data.mdCompleteDate),
      dtaAgreedDate: this.stringTodate(data.dtaAgreedDate),
      uploadAccessRequested: this.stringTodate(data.uploadAccessRequested),
      uploadAccessConfirmed: this.stringTodate(data.uploadAccessConfirmed),
      uploadsComplete: this.stringTodate(data.uploadsComplete),
      qcChecksCompleted: this.stringTodate(data.qcChecksCompleted),
      mdIntegratedWithMdr: this.stringTodate(data.mdIntegratedWithMdr),
      availabilityRequested: this.stringTodate(data.availabilityRequested),
      availabilityConfirmed: this.stringTodate(data.availabilityConfirmed),
    });
    const arr: any = this.statusList.filter((item: any) => item.id === this.dtpData.statusId);
    if (arr && arr.length) {
      this.currentStatus = arr[0].name.toLowerCase() === 'creation' ? 1 : arr[0].name.toLowerCase() === 'set up' ? 2 : arr[0].name.toLowerCase() === 'preparation' ? 3 : arr[0].name.toLowerCase() === 'transfer' ? 4 : arr[0].name.toLowerCase() === 'checking' ? 5 : arr[0].name.toLowerCase() === 'complete' ? 6 : 1;
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
      console.log('studyPayload', data);
    }, error => {})
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
  printDocument() {
    window.print();
  }
}
