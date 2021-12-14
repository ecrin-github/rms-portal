import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { StudyIdentifierInterface } from 'src/app/_rms/interfaces/study/study-identifiers.interface';
import { StudyService } from 'src/app/_rms/services/entities/study/study.service';

@Component({
  selector: 'app-study-identifier',
  templateUrl: './study-identifier.component.html',
  styleUrls: ['./study-identifier.component.scss']
})
export class StudyIdentifierComponent implements OnInit {
  form: FormGroup;
  identifierTypes: [] = [];
  subscription: Subscription = new Subscription();
  studyIdentifier: StudyIdentifierInterface;
  @Input() isView: boolean;
  @Input() isEdit: boolean;
  @Input() sdSid: string;

  constructor( private fb: FormBuilder, private studyService: StudyService, private spinner: NgxSpinnerService, private toastr: ToastrService) { 
    this.form = this.fb.group({
      studyIdentifiers: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.getIdentifierType();
    if(this.isEdit || this.isView) {
      this.getStudyIdentifier();
    }
  }
  studyIdentifiers(): FormArray {
    return this.form.get('studyIdentifiers') as FormArray;
  }

  newStudyIdentifier(): FormGroup {
    return this.fb.group({
      id: '',
      sdSid: '',
      identifierValue: '',
      identifierTypeId: '',
      identifierDate: '',
      identifierLink: '',
      identifierOrg: '',
      alreadyExist: false
    });
  }

  addStudyIdentifier() {
    this.studyIdentifiers().push(this.newStudyIdentifier());
  }

  removeStudyIdentifier(i: number) {
    this.studyIdentifiers().removeAt(i);
  }
  getIdentifierType() {
    setTimeout(() => {
      this.spinner.show(); 
    });
    const getIdentifierType$ = this.studyService.getIdentifierType().subscribe((res: any) => {
      if(res.data) {
        this.identifierTypes = res.data;
      }
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
      this.toastr.error(error);
    });
    this.subscription.add(getIdentifierType$);
  }
  getStudyIdentifier() {
    this.spinner.show();
    this.studyService.getStudyIdentifier(this.sdSid).subscribe((res:any) => {
      if(res && res.data) {
        this.studyIdentifier = res.data.length ? res.data : [];
        this.patchForm(this.studyIdentifier);
      }
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
      this.toastr.error(error);
    })
  }
  patchForm(identifiers) {
    this.form.setControl('studyIdentifiers', this.patchArray(identifiers));
  }
  patchArray(identifiers): FormArray {
    const formArray = new FormArray([]);
    identifiers.forEach(identifier => {
      formArray.push(this.fb.group({
        id: identifier.id,
        sdSid: identifier.sdSid,
        identifierValue: identifier.identifierValue,
        identifierTypeId: identifier.identifierTypeId,
        identifierDate: identifier.identifierDate ? this.stringTodate(identifier.identifierDate) : '',
        identifierLink: identifier.identifierLink,
        identifierOrg: identifier.identifierOrg,
        alreadyExist: true
      }))
    });
    return formArray;
  }
  addIdentifier(index) {
    this.spinner.show();
    const payload = this.form.value.studyIdentifiers[index];
    payload.sdSid = this.sdSid;
    payload.identifierDate = this.dateToString(payload.identifierDate);
    delete payload.id;
    
    this.studyService.addStudyIdentifier(this.sdSid, payload).subscribe((res: any) => {
      this.spinner.hide();
      if (res.statusCode === 200) {
        this.toastr.success('Study Identifier added successfully');
      }
    }, error => {
      this.spinner.hide();
      this.toastr.error(error);
    })
  }
  editIdentifier(identifierObject) {
    const payload = identifierObject.value;
    payload.identifierDate = this.dateToString(payload.identifierDate);
    this.spinner.show();
    this.studyService.editStudyIdentifier(payload.id, payload.sdSid, payload).subscribe((res: any) => {
      this.spinner.hide();
      if(res.statusCode === 200) {
        this.toastr.success('Study Identifier updated successfully');
      }
    }, error => {
      this.spinner.hide();
      this.toastr.error(error);
    });
  }
  dateToString(date) {
    return date.day + '/' + date.month + '/' + date.year
  }
  stringTodate(date) {
    const dateArray = date.split('/');
    return { year: parseInt(dateArray[2]), month: parseInt(dateArray[1]), day: parseInt(dateArray[0])};
  }
  findIdentifierType(id) {
    const identifierTypeArray:any = this.identifierTypes.filter((type: any) => type.id === id);
    return identifierTypeArray && identifierTypeArray.length ? identifierTypeArray[0].name : ''
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
