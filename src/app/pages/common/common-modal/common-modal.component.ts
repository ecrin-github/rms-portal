import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { DataObjectService } from 'src/app/_rms/services/entities/data-object/data-object.service';
import { StudyService } from 'src/app/_rms/services/entities/study/study.service';

@Component({
  selector: 'app-common-modal',
  templateUrl: './common-modal.component.html',
  styleUrls: ['./common-modal.component.scss']
})
export class CommonModalComponent implements OnInit {
  studyForm: FormGroup;
  objectForm: FormGroup;
  title: any;
  type: any;
  studyType: [] = [];
  objectType: [] = [];

  constructor( private activeModal: NgbActiveModal, private studyService: StudyService, private spinner: NgxSpinnerService, 
    private toastr: ToastrService, private objectService: DataObjectService, private fb: FormBuilder) { 
      this.studyForm = this.fb.group({
        targetSdSid: ''
      });
      this.objectForm = this.fb.group({
        targetsdOid: {value: '', disabled: true}
      });
    }

  ngOnInit(): void {
    if(this.type === 'study') {
      this.getStudyList();
    }
    if (this.type === 'dataObject') {
      this.getObjectList();
    }
  }
  closeModal(data) {
    this.activeModal.close(data);
  }
  save() {
    if (this.type === 'study') {
      const payload = this.studyForm.value.targetSdSid;
      let selectedStudy = [];
      payload.map ((item: any) => {
        const arr =  this.studyType.filter((item1: any) => item1.sdSid === item);
        if (arr && arr.length) {
          selectedStudy.push(arr[0]);
        }
      })
      this.closeModal(selectedStudy);
    }
    if (this.type === 'dataObject') {

    }
  }
  getStudyList() {
    this.spinner.show();
    this.studyService.getStudy().subscribe((res: any) => {
      this.spinner.hide();
      if (res && res.data) {
        this.studyType = res.data.length ? res.data : [];;
      }
    }, error => {
      this.spinner.hide();
      this.toastr.error(error.error.title);
    })
  }
  customSearchFn(term: string, item) {
    term = term.toLocaleLowerCase();
    return item.sdSid.toLocaleLowerCase().indexOf(term) > -1 || item.displayTitle.toLocaleLowerCase().indexOf(term) > -1;
  }
  getObjectList() {
    this.spinner.show();
    this.objectService.getObject().subscribe((res: any) => {
      this.spinner.hide();
      if (res && res.data) {
        this.objectType = res.data;
      }
    }, error => {
      this.spinner.hide();
      this.toastr.error(error.error.title);
    })
  }
  studyDropdownClose() {
    if (this.studyForm.value.targetSdSid.length) {
      this.objectForm.controls.targetsdOid.enable();
    } else {
      this.objectForm.controls.targetsdOid.disable();
    }
  }
}
