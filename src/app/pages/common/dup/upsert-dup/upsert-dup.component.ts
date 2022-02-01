import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { DupInterface } from 'src/app/_rms/interfaces/dup/dup.interface';
import { DtpService } from 'src/app/_rms/services/entities/dtp/dtp.service';
import { DupService } from 'src/app/_rms/services/entities/dup/dup.service';

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

  constructor( private router: Router, private fb: FormBuilder, private dupService: DupService, private spinner: NgxSpinnerService, private toastr: ToastrService,
    private activatedRoute: ActivatedRoute, private dtpService: DtpService) { 
      this.form = this.fb.group({
        orgId: '',
        displayName: '',
        statusId: '',
        initialContactDate: '',
        setUpCompleted: '',
        prereqsMet: '',
        duaAgreedDate: '',
        availabilityRequested: '',
        availabilityConfirmed: '',
        accessConfirmed: '',
      })
    }

  ngOnInit(): void {
    this.isEdit = this.router.url.includes('edit') ? true : false;
    this.isView = this.router.url.includes('view') ? true : false;
    if(this.isEdit || this.isView) {
      this.id = this.activatedRoute.snapshot.params.id;
      this.getDupById(this.id);
    }
    this.getOrganization();
    this.getStatus();
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
    this.dupService.getStatusList().subscribe((res: any) => {
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
    const payload = JSON.parse(JSON.stringify(this.form.value));
    payload.initialContactDate = this.dateToString(payload.initialContactDate);
    payload.setUpCompleted = this.dateToString(payload.setUpCompleted);
    payload.prereqsMet = this.dateToString(payload.prereqsMet);
    payload.duaAgreedDate = this.dateToString(payload.duaAgreedDate);
    payload.availabilityRequested = this.dateToString(payload.availabilityRequested);
    payload.availabilityConfirmed = this.dateToString(payload.availabilityConfirmed);
    payload.accessConfirmed = this.dateToString(payload.accessConfirmed);
    if (this.isEdit) {
      payload.id = this.id;
      this.spinner.show();
      this.dupService.editDup(this.id, payload).subscribe((res: any) => {
        this.spinner.hide();
        if (res.statusCode === 200) {
          this.toastr.success('DUP updated successfully');
          localStorage.setItem('updateDupList', 'true');
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
        } else {
          this.toastr.error(res.messages[0]);
        }
      }, error => {
        this.spinner.hide();
        this.toastr.error(error.error.title);
      })
    }
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
}
