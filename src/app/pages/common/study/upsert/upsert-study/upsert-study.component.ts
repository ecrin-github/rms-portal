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
      studyFeatures: '',
      studyTopics: '',
      studyRelationships: '',
      provenanceString: ''
    });
  }

  ngOnInit(): void {
    this.isEdit = this.router.url.includes('edit') ? true : false;
    this.isView = this.router.url.includes('view') ? true : false;
  }
  
  onSave() {
    console.log(this.studyForm.value);
  }

}
