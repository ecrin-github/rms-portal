import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { StudyService } from 'src/app/_rms/services/entities/study/study.service';

@Component({
  selector: 'app-study-feature',
  templateUrl: './study-feature.component.html',
  styleUrls: ['./study-feature.component.scss']
})
export class StudyFeatureComponent implements OnInit {
  form: FormGroup;
  featureTypes: [] = [];
  featureValues: []= [];
  subscription: Subscription = new Subscription();


  constructor( private fb: FormBuilder, private studyService: StudyService) { 
    this.form = this.fb.group({
      studyFeatures: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.getFeatureType();
    this.getFeaturValue();
  }
  
  studyFeatures(): FormArray {
    return this.form.get('studyFeatures') as FormArray;
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
  getFeatureType() {
    const getFeatureType$ = this.studyService.getFeatureType().subscribe((res: any) => {
      if(res.data) {
        this.featureTypes = res.data;
      }
    }, error => {
      console.log('error', error);
    });
    this.subscription.add(getFeatureType$);
  }
  getFeaturValue() {
    const getFeaturValue$ = this.studyService.getFeatureValue().subscribe((res: any) => {
      if (res.data) {
        this.featureValues = res.data;
      }
    }, error => {
      console.log('error', error);
    });
    this.subscription.add(getFeaturValue$);
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
