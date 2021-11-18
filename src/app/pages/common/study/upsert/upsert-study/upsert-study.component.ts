import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upsert-study',
  templateUrl: './upsert-study.component.html',
  styleUrls: ['./upsert-study.component.scss']
})
export class UpsertStudyComponent implements OnInit {
  public isCollapsed: boolean = false;
  studyForm: FormGroup;
  isEdit: boolean = false;
  isView: boolean = false;

  constructor(private fb: FormBuilder, private router: Router) {
    this.studyForm = this.fb.group({
      displayTitle: '',
      briefDescription: '',
      dataSharingStatement: '',
      studyType: '',
      studyStatus: '',
      studyGenderElig: '',
      studyEnrolment: 0,
      minAge: this.fb.group({
        value: 0,
        unitName: ''
      }),
      maxAge: this.fb.group({
        value: 0,
        unitName: ''
      }),
      studyIdentifiers: '',
      studyTitles: '',
      studyFeatures: this.fb.array([]),
      studyTopics: this.fb.array([]),
      studyRelationships: this.fb.array([]),
      provenanceString: ''
    });
  }

  ngOnInit(): void {
    this.isEdit = this.router.url.includes('edit') ? true : false;
    this.isView = this.router.url.includes('view') ? true : false;
  }
  
  studyFeatures(): FormArray {
    return this.studyForm.get('studyFeatures') as FormArray;
  }

  newStudyFeature(): FormGroup {
    return this.fb.group({
      featureType: '',
      featureValue: ''
    });
  }

  addStudyFeature() {
    this.studyFeatures().push(this.newStudyFeature());
  }

  removeStudyFeature(i: number) {
    this.studyFeatures().removeAt(i);
  }


  studyTopics(): FormArray {
    return this.studyForm.get('studyTopics') as FormArray;
  }

  newStudyTopic(): FormGroup {
    return this.fb.group({
      topicType: '',
      meshCoded: false,
      topicCode: '',
      topicValue: '',
      topicQualCode: '',
      topicQualValue: '',
      originalValue: '',
    });
  }

  addStudyTopic() {
    this.studyTopics().push(this.newStudyTopic());
  }

  removeStudyTopic(i: number) {
    this.studyTopics().removeAt(i);
  }


  studyRelationships(): FormArray {
    return this.studyForm.get('studyRelationships') as FormArray;
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


  onSave() {
    console.log(this.studyForm.value);
  }

}
