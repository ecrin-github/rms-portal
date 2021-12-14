import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { StudyFeatureInterface } from 'src/app/_rms/interfaces/study/study-feature.interface';
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
  @Input() isView: boolean;
  @Input() isEdit: boolean;
  @Input() sdSid: string;
  studyFeature: StudyFeatureInterface;


  constructor( private fb: FormBuilder, private studyService: StudyService, private spinner: NgxSpinnerService, private toastr: ToastrService) { 
    this.form = this.fb.group({
      studyFeatures: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.getFeatureType();
    this.getFeaturValue();
    if (this.isEdit || this.isView) {
      this.getStudyFeature()
    }
  }
  
  studyFeatures(): FormArray {
    return this.form.get('studyFeatures') as FormArray;
  }

  newStudyFeature(): FormGroup {
    return this.fb.group({
      id: '',
      sdSid: '',
      featureTypeId: '',
      featureValueId: '',
      alreadyExist: false
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
  getStudyFeature() {
    this.spinner.show();
    this.studyService.getStudyFeature(this.sdSid).subscribe((res: any) => {
      if (res && res.data) {
        this.studyFeature = res.data.length ? res.data : [];
        this.patchForm(this.studyFeature);
      }
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
      this.toastr.error(error);
    })
  }
  patchForm(features) {
    this.form.setControl('studyFeatures', this.patchArray(features));
  }
  patchArray(features): FormArray {
    const formArray = new FormArray([]);
    features.forEach(feature => {
      formArray.push(this.fb.group({
        id: feature.id,
        sdSid: feature.sdSid,
        featureTypeId: feature.featureTypeId,
        featureValueId: feature.featureValueId,
        alreadyExist: true
      }))
    });
    return formArray;
  }
  addFeature(index) {
    this.spinner.show();
    const payload = this.form.value.studyFeatures[index];
    payload.sdSid = this.sdSid;
    delete payload.id;

    this.studyService.addStudyFeature(this.sdSid, payload).subscribe((res: any) => {
      this.spinner.hide();
      if (res.statusCode === 200) {
        this.toastr.success('Study Feature added successfully');
      }
    }, error => {
      this.spinner.hide();
      this.toastr.error(error);
    });
  }
  editFeature(featureObject) {
    const payload = featureObject.value;
    this.spinner.show();
    this.studyService.editStudyFeature(payload.id, payload.sdSid, payload).subscribe((res: any) => {
      this.spinner.hide();
      if (res.statusCode === 200) {
        this.toastr.success('Study Feature updated successfully');
      }
    }, error => {
      this.spinner.hide();
      this.toastr.error(error);
    })
  }
  findFeatureType(id){
    const featureTypeArray: any = this.featureTypes.filter((type: any) => type.id === id);
    return featureTypeArray && featureTypeArray.length ? featureTypeArray[0].name : '';
  }
  findFeatureValue(id){
    const featureValueArray: any = this.featureValues.filter((type: any) => type.id === id);
    return featureValueArray && featureValueArray.length ? featureValueArray[0].name : '';
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
