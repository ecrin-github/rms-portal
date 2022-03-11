import { Component, OnInit } from '@angular/core';
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
  title: any;
  type: any;
  studyType: [] = [];
  objectType: [] = [];

  constructor( private activeModal: NgbActiveModal, private studyService: StudyService, private spinner: NgxSpinnerService, 
    private toastr: ToastrService, private objectService: DataObjectService) { }

  ngOnInit(): void {
    if(this.type === 'study') {
      this.getStudyList();
    }
    if (this.type === 'dataObject') {
      this.getObjectList();
    }
  }
  closeModal() {
    this.activeModal.close();
  }
  save() {

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
}
