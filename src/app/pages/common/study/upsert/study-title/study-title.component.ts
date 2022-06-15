import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { StudyTitleInterface } from 'src/app/_rms/interfaces/study/study-title.interface';
import { StudyService } from 'src/app/_rms/services/entities/study/study.service';
import { ConfirmationWindowComponent } from '../../../confirmation-window/confirmation-window.component';

@Component({
  selector: 'app-study-title',
  templateUrl: './study-title.component.html',
  styleUrls: ['./study-title.component.scss']
})
export class StudyTitleComponent implements OnInit {
  form: FormGroup;
  titleType: [] = [];
  languageCodes: [] = [];
  subscription: Subscription = new Subscription();
  @Input() isView: boolean;
  @Input() isEdit: boolean;
  @Input() sdSid: string;
  @Input() set initiateEmit(initiateEmit: any) {
    if (initiateEmit) {
      this.emitData();
    }
  }
  titleAdded = false;
  @Input() set publicTitle(title: any) {
    if (title) {
      this.createPublicTitle(title);
      this.titleAdded = true;
    }
  }

  @Output() emitTitle: EventEmitter<any> = new EventEmitter();
  studyTitle: StudyTitleInterface

  constructor( private fb: FormBuilder, private studyService: StudyService, private spinner: NgxSpinnerService, private toastr: ToastrService, private modalService: NgbModal) {
    this.form = this.fb.group({
      studyTitles: this.fb.array([])
    });
   }

  ngOnInit(): void {
    this.getTitleType();
    this.getLanguageCode();
    if (this.isEdit || this.isView) {
      this.getStudyTitle();
    }
  }
  studyTitles(): FormArray {
    return this.form.get('studyTitles') as FormArray;
  }

  newStudyTitle(): FormGroup {
    return this.fb.group({
      id: '',
      sdSid: '',
      titleTypeId: null,
      titleText: '',
      langCode: 'en',
      comments: '',
      alreadyExist: false,
      isTitleLinked: false
    });
  }

  addStudyTitle() {
    const len = this.studyTitles().value.length;
    if (len) {
      if (this.studyTitles().value[len-1].titleTypeId && this.studyTitles().value[len-1].titleText) {
        this.studyTitles().push(this.newStudyTitle());
      } else {
        this.toastr.info('Please provide the Title Type and Title Value in the previously added Study Title');
      }
    } else {
      this.studyTitles().push(this.newStudyTitle());
    }
  }

  removeStudyTitle(i: number) {
    if (!this.studyTitles().value[i].alreadyExist) {
      this.studyTitles().removeAt(i);
    } else {
      const removeModal = this.modalService.open(ConfirmationWindowComponent, {size: 'lg', backdrop: 'static'});
      removeModal.componentInstance.type = 'studyTitle';
      removeModal.componentInstance.id = this.studyTitles().value[i].id;
      removeModal.componentInstance.sdSid = this.studyTitles().value[i].sdSid;
      removeModal.result.then((data) => {
        if (data) {
          this.studyTitles().removeAt(i);
        }
      }, error => {})
    }
  }
  createPublicTitle(title) {
    if (!this.isEdit && !this.isView) {
      if (!this.titleAdded) {
        const publicType: any = this.titleType.filter((item: any) => item.name === 'Public title');
        this.studyTitles().push(this.fb.group({
          id: '',
          sdSid: '',
          titleTypeId: publicType && publicType.length ? publicType[0].id : '',
          titleText: title,
          langCode: '',
          comments: '',
          alreadyExist: false,
          isTitleLinked: true
        }))
      } 
      if (this.titleAdded) {
        let titleArr = <FormArray>this.form.controls["studyTitles"];
        titleArr.controls[0].patchValue({
          titleText: title
        });
      }
    }
  }
  getTitleType() {
    setTimeout(() => {
      this.spinner.show(); 
    });
    const getTitleType$ = this.studyService.getTitleType().subscribe((res:any) => {
      this.spinner.hide();
      if(res.data) {
        this.titleType = res.data;
      }
    }, error => {
      this.spinner.hide();
      this.toastr.error(error.error.title);
    });
    this.subscription.add(getTitleType$);
  }
  getLanguageCode() {
    setTimeout(() => {
      this.spinner.show(); 
    });
    this.studyService.getLanguageCode().subscribe((res: any) => {
      this.spinner.hide();
      if (res.data) {
        this.languageCodes = res.data;
      }
    }, error => {
      this.spinner.hide();
      this.toastr.error(error.error.title);
    })
  }
  getStudyTitle() {
    this.spinner.show();
    this.studyService.getStudyTitle(this.sdSid).subscribe((res: any) => {
      if (res && res.data) {
        this.studyTitle = res.data.length ? res.data : [];
        this.patchForm(this.studyTitle);
      }
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
      this.toastr.error(error.error.title);
    })
  }
  patchForm(titles) {
    this.form.setControl('studyTitles', this.patchArray(titles));
  }
  patchArray(titles): FormArray {
    const formArray = new FormArray([]);
    titles.forEach(title => {
      formArray.push(this.fb.group({
        id: title.id,
        sdSid: title.sdSid,
        titleTypeId: title.titleTypeId,
        titleText: title.titleText,
        langCode: title.langCode,
        comments: title.comments,
        alreadyExist: true
      }))
    });
    return formArray;
  }
  addTitle(index) {
    this.spinner.show();
    const payload = this.form.value.studyTitles[index];
    payload.sdSid = this.sdSid;
    delete payload.id;

    this.studyService.addStudyTitle(this.sdSid, payload).subscribe((res: any) => {
      this.spinner.hide();
      if (res.statusCode === 200) {
        this.toastr.success('Study Title added successfully');
      } else {
        this.toastr.error(res.messages[0]);
      }
    }, error => {
      this.spinner.hide();
      this.toastr.error(error.error.title);
    });
  }
  editTitle(titleObject) {
    const payload = titleObject.value;
    this.spinner.show();
    this.studyService.editStudyTitle(payload.id, payload.sdSid, payload).subscribe((res: any) => {
      this.spinner.hide();
      if(res.statusCode === 200) {
        this.toastr.success('Study Title updated successfully');
      } else {
        this.toastr.error(res.messages[0]);
      }
    }, error => {
      this.spinner.hide();
      this.toastr.error(error.error.title);
    })
  }
  findTitleType(id) {
    const titleTypeArray: any = this.titleType.filter((type: any) => type.id === id);
    return titleTypeArray && titleTypeArray.length ? titleTypeArray[0].name : '';
  }
  emitData() {
    const payload = this.form.value.studyTitles.map(item => {
      if (!item.id) {
        delete item.id;
      }
      if(this.sdSid) {
        item.sdSid = this.sdSid;
      }
      return item;
    })
    this.emitTitle.emit({data: payload, isEmit: false});
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
