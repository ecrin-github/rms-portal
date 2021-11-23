import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { StudyService } from 'src/app/_rms/services/entities/study/study.service';

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
  studyTypes: [] = [];
  studyStatuses: [] = [];
  genderEligibility: [] = [];
  timeUnits: [] =[];
  subscription: Subscription = new Subscription();


  constructor(private fb: FormBuilder, private router: Router, private studyService: StudyService) {
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
    this.getStudyType();
    this.getStudyStatus();
    this.getGenderEligibility();
    this.getTimeUnits();
  }
  getStudyType() {
    const getStudyType$ = this.studyService.getStudyType().subscribe((res:any) => {
      if(res.data) {
        this.studyTypes = res.data;
      }
    }, error => {
      console.log('error', error);
    });
    this.subscription.add(getStudyType$);
  }
  getStudyStatus() {
    const getStudyStatus$ = this.studyService.getStudyStatus().subscribe((res: any) => {
      if(res.data) {
        this.studyStatuses = res.data;
      }
    }, error => {
      console.log('error', error);
    });
    this.subscription.add(getStudyStatus$);
  }
  getGenderEligibility() {
    const getGenderEligibility$ = this.studyService.getGenderEligibility().subscribe((res: any) => {
      if (res.data) {
        this.genderEligibility = res.data;
      }
    }, error => {
      console.log('error', error);
    });
    this.subscription.add(getGenderEligibility$);
  }
  getTimeUnits() {
    const getTimeUnits$ = this.studyService.getTimeUnits().subscribe((res: any) => {
      if(res.data) {
        this.timeUnits = res.data;
      }
    }, error => {
      console.log('error', error);
    });
    this.subscription.add(getTimeUnits$);
  }
  
  onSave() {
    console.log(this.studyForm.value);
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
