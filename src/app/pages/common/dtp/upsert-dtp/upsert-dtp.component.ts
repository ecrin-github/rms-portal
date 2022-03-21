import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
  currentStatus: number = 1;

  constructor( private router: Router, private fb: FormBuilder, private dtpService: DtpService, private spinner: NgxSpinnerService, private toastr: ToastrService,
    private activatedRoute: ActivatedRoute, private modalService: NgbModal) { 
    this.form = this.fb.group({
      orgId: '',
      displayName: '',
      statusId: '',
      initialContactDate: '',
      setUpCompleted: '',
      mdAccessGranted: '',
      mdCompleteDate: '',
      dtaAgreedDate: '',
      uploadAccessRequested: '',
      uploadAccessConfirmed: '',
      uploadsComplete: '',
      qcChecksCompleted: '',
      mdIntegratedWithMdr: '',
      availabilityRequested: '',
      availabilityConfirmed: '',
    })
  }

  ngOnInit(): void {
    this.getOrganization();
    this.getStatus();
    this.isEdit = this.router.url.includes('edit') ? true : false;
    this.isView = this.router.url.includes('view') ? true : false;
    if (this.isEdit || this.isView) {
      this.id = this.activatedRoute.snapshot.params.id;
      this.getDtpById(this.id);
    }
  }
  ngAfterViewInit() {
    this.wizard = new KTWizard(this.el.nativeElement, {
      startStep: 1,
      clickableSteps: true
    });
  }
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
        } else {
          this.toastr.error(res.messages[0]);
        }
      }, error => {
        this.spinner.hide();
        this.toastr.error(error.error.title);
      })
    }
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
