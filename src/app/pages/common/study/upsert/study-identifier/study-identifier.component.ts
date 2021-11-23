import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
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


  constructor( private fb: FormBuilder, private studyService: StudyService) { 
    this.form = this.fb.group({
      studyIdentifiers: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.getIdentifierType();
  }
  studyIdentifiers(): FormArray {
    return this.form.get('studyIdentifiers') as FormArray;
  }

  newStudyIdentifier(): FormGroup {
    return this.fb.group({
      identifierValue: '',
      identifierType: '',
      identifierDate: '',
      identifierLink: '',
      identifierOrg: ''
    });
  }

  addStudyIdentifier() {
    this.studyIdentifiers().push(this.newStudyIdentifier());
  }

  removeStudyIdentifier(i: number) {
    this.studyIdentifiers().removeAt(i);
  }
  getIdentifierType() {
    const getIdentifierType$ = this.studyService.getIdentifierType().subscribe((res: any) => {
      if(res.data) {
        this.identifierTypes = res.data;
      }
    }, error => {
      console.log('error', error);
    });
    this.subscription.add(getIdentifierType$);
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
