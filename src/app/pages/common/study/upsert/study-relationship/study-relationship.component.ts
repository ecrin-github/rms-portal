import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-study-relationship',
  templateUrl: './study-relationship.component.html',
  styleUrls: ['./study-relationship.component.scss']
})
export class StudyRelationshipComponent implements OnInit {
  form: FormGroup;

  constructor( private fb: FormBuilder) {
    this.form = this.fb.group({
      studyRelationships: this.fb.array([])
    });
   }

  ngOnInit(): void {
  }
  studyRelationships(): FormArray {
    return this.form.get('studyRelationships') as FormArray;
  }

  newStudyRelation(): FormGroup {
    return this.fb.group({
      relationshipType: '',
      targetStudyId: ''
    });
  }

  addStudyRelation() {
    this.studyRelationships().push(this.newStudyRelation());
  }

  removeStudyRelation(i: number) {
    this.studyRelationships().removeAt(i);
  }

}
