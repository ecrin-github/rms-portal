import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ObjectTitleInterface } from 'src/app/_rms/interfaces/data-object/object-title.interface';
import { DataObjectService } from 'src/app/_rms/services/entities/data-object/data-object.service';
import { StudyService } from 'src/app/_rms/services/entities/study/study.service';
import { ConfirmationWindowComponent } from '../../../confirmation-window/confirmation-window.component';

@Component({
  selector: 'app-object-title',
  templateUrl: './object-title.component.html',
  styleUrls: ['./object-title.component.scss']
})
export class ObjectTitleComponent implements OnInit {
  form: FormGroup;
  languageCode: [] = [];
  titleType: [] = [];
  subscription: Subscription = new Subscription();
  @Input() sdOid: string;
  @Input() isView: boolean;
  @Input() isEdit: boolean;
  objectTitle: ObjectTitleInterface;
  @Input() set initiateEmit(initiateEmit: any) {
    if (initiateEmit) {
      this.emitData();
    }
  }
  @Output() emitTitle: EventEmitter<any> = new EventEmitter();
  len: any;

  constructor( private fb: FormBuilder, private objectService: DataObjectService, private studyService: StudyService, private spinner: NgxSpinnerService, private toastr: ToastrService, private modalService: NgbModal) {
    this.form = this.fb.group({
      objectTitles: this.fb.array([])
    });
   }

  ngOnInit(): void {
    this.getLanguageCode();
    this.getTitleType();
    if (this.isEdit || this.isView) {
      this.getObjectTitle();
    }
  }
  objectTitles(): FormArray {
    return this.form.get('objectTitles') as FormArray;
  }

  newObjectTitle(): FormGroup {
    return this.fb.group({
      id: '',
      sdOid: '',
      titleTypeId: '',
      titleText: '',
      langCode: 'en',
      comments: '',
      alreadyExist: false
    });
  }

  addObjectTitle() {
    this.len = this.objectTitles().value.length;
    if (this.len) {
      if (this.objectTitles().value[this.len-1].titleTypeId && this.objectTitles().value[this.len-1].titleText) {
        this.objectTitles().push(this.newObjectTitle());
      } else {
        this.toastr.info('Please provide the Title Type and Title text in the previously added Object Title');
      }
    } else {
      this.objectTitles().push(this.newObjectTitle());
    }
  }

  removeObjectTitle(i: number) {
    if (!this.objectTitles().value[i].alreadyExist) {
      this.objectTitles().removeAt(i);
    } else {
      const removeModal = this.modalService.open(ConfirmationWindowComponent, {size: 'lg', backdrop: 'static'});
      removeModal.componentInstance.type = 'objectTitle';
      removeModal.componentInstance.id = this.objectTitles().value[i].id;
      removeModal.componentInstance.sdOid = this.objectTitles().value[i].sdOid;
      removeModal.result.then((data) => {
        if (data) {
          this.objectTitles().removeAt(i);
        }
      }, error => {})
    }
  }
  getLanguageCode() {
    const getLanguageCode$ = this.objectService.getLanguageCode().subscribe((res:any) => {
      if(res.data) {
        this.languageCode = res.data;
      }
    }, error => {
      console.log('error', error);
    });
    this.subscription.add(getLanguageCode$);
  }
  getTitleType() {
    const getTitleType$ = this.studyService.getTitleType().subscribe((res:any) => {
      if(res.data) {
        this.titleType = res.data;
      }
    }, error => {
      console.log('error', error);
    });
    this.subscription.add(getTitleType$);
  }
  getObjectTitle() {
    this.spinner.show();
    this.objectService.getObjectTitle(this.sdOid).subscribe((res: any) => {
      this.spinner.hide();
      if (res && res.data) {
        this.objectTitle = res.data.length ? res.data : [];
        this.patchForm(this.objectTitle);
      }
    }, error => {
      this.spinner.hide();
      this.toastr.error(error.error.title);
    })
  }
  patchForm(titles) {
    this.form.setControl('objectTitles', this.patchArray(titles));
  }
  patchArray(titles): FormArray {
    const formArray = new FormArray([]);
    titles.forEach(title => {
      formArray.push(this.fb.group({
        id: title.id,
        sdOid: title.sdOid,
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
    const payload = this.form.value.objectTitles[index];
    payload.sdOid = this.sdOid;
    delete payload.id;

    this.objectService.addObjectTitle(this.sdOid, payload).subscribe((res: any) => {
      this.spinner.hide();
      if (res.statusCode === 200) {
        this.toastr.success('Object Title added successfully');
      } else {
        this.toastr.error(res.messages[0]);
      }
    }, error => {
      this.spinner.hide();
      this.toastr.error(error.error.title);
    })
  }
  editTitle(titleObject) {
    const payload = titleObject.value;
    this.spinner.show();
    this.objectService.editObjectTitle(payload.id, payload.sdOid, payload).subscribe((res: any) => {
      this.spinner.hide();
      if (res.statusCode === 200) {
        this.toastr.success('Object Title updated successfully');
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
    return titleTypeArray && titleTypeArray.length ? titleTypeArray[0].name : ''
  }
  emitData() {
    const payload = this.form.value.objectTitles.map(item => {
      if (!item.id) {
        delete item.id;
      }
      if (this.sdOid) {
        item.sdOid = this.sdOid;
      }
      return item;
    })
    this.emitTitle.emit({data: payload, isEmit: false});
  }
  scrollToElement(): void {
    setTimeout(() => {
      const yOffset = -200; 
      const element = document.getElementById('objecttitle'+this.len);
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({top: y, behavior: 'smooth'});
    });
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
