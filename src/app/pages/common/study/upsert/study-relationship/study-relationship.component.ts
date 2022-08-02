import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { StudyRelationshipInterface } from 'src/app/_rms/interfaces/study/study-relationship.interface';
import { StudyService } from 'src/app/_rms/services/entities/study/study.service';
import { ConfirmationWindowComponent } from '../../../confirmation-window/confirmation-window.component';

@Component({
  selector: 'app-study-relationship',
  templateUrl: './study-relationship.component.html',
  styleUrls: ['./study-relationship.component.scss']
})
export class StudyRelationshipComponent implements OnInit {
  form: FormGroup;
  relationshipType: [] = [];
  studyType:[] = [];
  subscription: Subscription = new Subscription();
  @Input() isView: boolean;
  @Input() isEdit: boolean;
  @Input() sdSid: string;
  @Input() set initiateEmit(initiateEmit: any) {
    if (initiateEmit) {
      this.emitData();
    }
  }
  @Output() emitRelation: EventEmitter<any> = new EventEmitter();
  studyRelationship: StudyRelationshipInterface;
  len: any;

  constructor( private fb: FormBuilder, private studyService: StudyService, private toastr: ToastrService, private spinner: NgxSpinnerService, private modalService: NgbModal) {
    this.form = this.fb.group({
      studyRelationships: this.fb.array([])
    });
   }

  ngOnInit(): void {
    this.getRelationshipType();
    this.getStudyList();
    if (this.isEdit || this.isView) {
      this.getStudyRelationship()
    }
  }
  studyRelationships(): FormArray {
    return this.form.get('studyRelationships') as FormArray;
  }

  newStudyRelation(): FormGroup {
    return this.fb.group({
      id: '',
      sdSid: '',
      relationshipTypeId: null,
      targetSdSid: null,
      alreadyExist: false
    });
  }

  addStudyRelation() {
    this.len = this.studyRelationships().value.length;
    if (this.len) {
      if (this.studyRelationships().value[this.len-1].relationshipTypeId && this.studyRelationships().value[this.len-1].targetSdSid) {
        this.studyRelationships().push(this.newStudyRelation());
      } else {
        this.toastr.info('Please provide the Relationship Type and Target study in the previously added Study Relationship');
      }
    } else {
      this.studyRelationships().push(this.newStudyRelation());
    }
  }

  removeStudyRelation(i: number) {
    if(!this.studyRelationships().value[i].alreadyExist) {
      this.studyRelationships().removeAt(i);
    } else {
      const removeModal = this.modalService.open(ConfirmationWindowComponent, {size: 'lg', backdrop: 'static'});
      removeModal.componentInstance.type = 'studyRelationship';
      removeModal.componentInstance.id = this.studyRelationships().value[i].id;
      removeModal.componentInstance.sdSid = this.studyRelationships().value[i].sdSid;
      removeModal.result.then((data) => {
        if (data) {
          this.studyRelationships().removeAt(i);
        }
      }, error => {})
    }
  }
  getRelationshipType() {
    const getRelationshipType$ = this.studyService.getReleationshiType().subscribe((res: any) => {
      if(res.data) {
        this.relationshipType = res.data;
      }
    }, error => {
      this.toastr.error(error.error.title);
    });
    this.subscription.add(getRelationshipType$);
  }
  getStudyList() {
    setTimeout(() => {
      this.spinner.show();
    });
    this.studyService.getStudy().subscribe((res: any) => {
      this.spinner.hide();
      if (res && res.data) {
        this.studyType = res.data.length ? res.data : [];
      }
    }, error => {
      this.spinner.hide();
      this.toastr.error(error.error.title);
    })
  }
  getStudyRelationship() {
    this.spinner.show();
    this.studyService.getStudyRelationship(this.sdSid).subscribe((res: any) => {
      this.spinner.hide();
      if (res && res.data) {
        this.studyRelationship = res.data.length ? res.data : [];
        this.patchForm(this.studyRelationship);
      }
    }, error => {
      this.spinner.hide();
      this.toastr.error(error.error.title);
    })
  }
  patchForm(relationhips) {
    this.form.setControl('studyRelationships', this.patchArray(relationhips));
  }
  patchArray(relationships): FormArray {
    const formArray = new FormArray([]);
    relationships.forEach(relationship => {
      formArray.push(this.fb.group({
        id: relationship.id,
        sdSid: relationship.sdSid,
        relationshipTypeId: relationship.relationshipTypeId,
        targetSdSid: relationship.targetSdSid,
        alreadyExist: true
      }))
    });
    return formArray;
  }
  addRelationship(index) {
    this.spinner.show();
    const payload = this.form.value.studyRelationships[index];
    payload.sdSid = this.sdSid;
    delete payload.id;

    this.studyService.addStudyRelationship(this.sdSid, payload).subscribe((res: any) => {
      this.spinner.hide();
      if (res.statusCode === 200) {
        this.toastr.success('Study Relationship added successfully');
      } else {
        this.toastr.error(res.messages[0]);
      }
    }, error => {
      this.spinner.hide();
      this.toastr.error(error.error.title);
    })
  }
  editRelationship(relationObject) {
    const payload = relationObject.value;
    this.spinner.show();
    this.studyService.editStudyRelationship(payload.id, payload.sdSid, payload).subscribe((res: any) => {
      this.spinner.hide();
      if (res.statusCode === 200) {
        this.toastr.success('Study Relationship updated successfully');
      } else {
        this.toastr.error(res.messages[0]);
      }
    }, error => {
      this.spinner.hide();
      this.toastr.error(error.error.title);
    })
  }
  findRelationshipType(id) {
    const relationArray: any = this.relationshipType.filter((type: any) => type.id === id);
    return relationArray && relationArray.length ? relationArray[0].name : '';
  }
  findStudyTitle(id) {
    const studyArray: any = this.studyType.filter((type: any) => type.sdSid === id);
    return studyArray && studyArray.length ? studyArray[0].displayTitle : ''
  }
  emitData() {
    const payload = this.form.value.studyRelationships.map(item => {
      if (!item.id) {
        delete item.id;
      }
      if(this.sdSid) {
        item.sdSid = this.sdSid;
      }
      return item;
    })
    this.emitRelation.emit({data: payload, isEmit: false});
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  customSearchFn(term: string, item) {
    term = term.toLocaleLowerCase();
    return item.sdSid.toLocaleLowerCase().indexOf(term) > -1 || item.displayTitle.toLocaleLowerCase().indexOf(term) > -1;
  }
  scrollToElement(): void {
    setTimeout(() => {
      const yOffset = -200; 
      const element = document.getElementById('relpanel'+this.len);
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({top: y, behavior: 'smooth'});
    });
  }

}
