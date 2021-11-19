import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-study-feature',
  templateUrl: './study-feature.component.html',
  styleUrls: ['./study-feature.component.scss']
})
export class StudyFeatureComponent implements OnInit {
  form: FormGroup;

  constructor( private fb: FormBuilder) { 
    this.form = this.fb.group({
      studyFeatures: this.fb.array([])
    });
  }

  ngOnInit(): void {
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

}
