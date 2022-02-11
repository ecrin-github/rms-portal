import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  featureValues = [];
  featureValuesAll: [] = [];
  subscription: Subscription = new Subscription();
  @Input() isView: boolean;
  @Input() isEdit: boolean;
  @Input() sdSid: string;
  @Input() set initiateEmit(initiateEmit: any) {
    if (initiateEmit) {
      this.emitData();
    }
  }
  @Output() emitFeature: EventEmitter<any> = new EventEmitter();
  studyFeature: StudyFeatureInterface;


  constructor(private fb: FormBuilder, private studyService: StudyService, private spinner: NgxSpinnerService, private toastr: ToastrService) {
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
    this.featureValues.push([]);
  }

  removeStudyFeature(i: number) {
    this.studyFeatures().removeAt(i);
    this.featureValues.splice(i, 1);
  }
  getFeatureType() {
    const getFeatureType$ = this.studyService.getFeatureType().subscribe((res: any) => {
      if (res.data) {
        this.featureTypes = res.data;
      }
    }, error => {
      this.toastr.error(error.error.title);
    });
    this.subscription.add(getFeatureType$);
  }
  getFeaturValue() {
    const getFeaturValue$ = this.studyService.getFeatureValue().subscribe((res: any) => {
      if (res.data) {
        this.featureValuesAll = res.data;
      }
    }, error => {
      this.toastr.error(error.error.title);
    });
    this.subscription.add(getFeaturValue$);
  }
  onFeatureChange(event, id) {
    const featureVal= this.featureValuesAll.filter((item:any) => item.featureTypeId === parseInt(event.target.value));
    this.featureValues[id] = featureVal;
  }
  getStudyFeature() {
    this.spinner.show();
    this.studyService.getStudyFeature(this.sdSid).subscribe((res: any) => {
      this.spinner.hide();
      if (res && res.data) {
        this.studyFeature = res.data.length ? res.data : [];
        this.patchForm(this.studyFeature);
      }
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
      this.toastr.error(error.error.title);
    })
  }
  patchForm(features) {
    this.form.setControl('studyFeatures', this.patchArray(features));
  }
  patchArray(features): FormArray {
    const formArray = new FormArray([]);
    features.forEach( (feature, index) => {
      formArray.push(this.fb.group({
        id: feature.id,
        sdSid: feature.sdSid,
        featureTypeId: feature.featureTypeId,
        featureValueId: feature.featureValueId,
        alreadyExist: true
      }))
      const featureVal= this.featureValuesAll.filter((item:any) => item.featureTypeId === parseInt(feature.featureTypeId));
      this.featureValues[index] = featureVal;
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
      } else {
        this.toastr.error(res.messages[0]);
      }
    }, error => {
      this.spinner.hide();
      this.toastr.error(error.error.title);
    });
  }
  editFeature(featureObject) {
    const payload = featureObject.value;
    this.spinner.show();
    this.studyService.editStudyFeature(payload.id, payload.sdSid, payload).subscribe((res: any) => {
      this.spinner.hide();
      if (res.statusCode === 200) {
        this.toastr.success('Study Feature updated successfully');
      } else {
        this.toastr.error(res.messages[0]);
      }
    }, error => {
      this.spinner.hide();
      this.toastr.error(error.error.title);
    })
  }
  findFeatureType(id) {
    const featureTypeArray: any = this.featureTypes.filter((type: any) => type.id === id);
    return featureTypeArray && featureTypeArray.length ? featureTypeArray[0].name : '';
  }
  findFeatureValue(id) {
    const featureValueArray: any = this.featureValues.filter((type: any) => type.id === id);
    return featureValueArray && featureValueArray.length ? featureValueArray[0].name : '';
  }
  emitData() {
    const payload = this.form.value.studyFeatures.map(item => {
      if (!item.id) {
        delete item.id;
      }
      if (this.sdSid) {
        item.sdSid = this.sdSid;
      }
      return item;
    })
    this.emitFeature.emit({ data: payload, isEmit: false });
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
