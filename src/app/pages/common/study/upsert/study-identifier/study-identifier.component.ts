import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-study-identifier',
  templateUrl: './study-identifier.component.html',
  styleUrls: ['./study-identifier.component.scss']
})
export class StudyIdentifierComponent implements OnInit {
  form: FormGroup;

  constructor( private fb: FormBuilder) { 
    this.form = this.fb.group({
      studyIdentifiers: this.fb.array([])
    });
  }

  ngOnInit(): void {
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

}
