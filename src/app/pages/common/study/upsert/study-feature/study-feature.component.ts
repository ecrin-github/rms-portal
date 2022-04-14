import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { combineLatest, Subscription } from 'rxjs';
import { StudyFeatureInterface } from 'src/app/_rms/interfaces/study/study-feature.interface';
import { StudyService } from 'src/app/_rms/services/entities/study/study.service';
import { ConfirmationWindowComponent } from '../../../confirmation-window/confirmation-window.component';

@Component({
  selector: 'app-study-feature',
  templateUrl: './study-feature.component.html',
  styleUrls: ['./study-feature.component.scss']
})
export class StudyFeatureComponent implements OnInit {
  form: FormGroup;
  featureTypes: [] = [];
  featureValues = [];
  featureValInter = [];
  featureValObe = [];
  featureValuesAll: [] = [];
  featureInterventional = [];
  featureObservational = [];
  selectedStudyType: any;
  subscription: Subscription = new Subscription();
  @Input() isView: boolean;
  @Input() isEdit: boolean;
  @Input() sdSid: string;
  @Input() set initiateEmit(initiateEmit: any) {
    if (initiateEmit) {
      this.emitData();
    }
  }
  @Input() set studyType(studyType: any) {
    this.selectedStudyType = studyType;
    console.log(this.selectedStudyType);
    this.studyTypeChange();
  }
  @Output() emitFeature: EventEmitter<any> = new EventEmitter();
  studyFeature = [];
  showAll: boolean = true;


  constructor(private fb: FormBuilder, private studyService: StudyService, private spinner: NgxSpinnerService, private toastr: ToastrService, private modalService: NgbModal) {
    this.form = this.fb.group({
      studyFeatures: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.getFeature();
    if (this.isEdit || this.isView) {
      this.getStudyFeature()
    }
  }

  studyFeatures(): FormArray {
    return this.form.get('studyFeatures') as FormArray;
  }

  newStudyFeature(featureTypeId): FormGroup {
    return this.fb.group({
      id: '',
      sdSid: '',
      featureTypeId: featureTypeId,
      featureValueId: '',
      alreadyExist: false
    });
  }
  getStudyFeature() {
    this.spinner.show();
    this.studyService.getStudyFeature(this.sdSid).subscribe((res: any) => {
      this.spinner.hide();
      if (res && res.data) {
        this.studyFeature = res.data.length ? res.data : [];
        if (this.isEdit || this.isView) {
          this.form.value.studyFeatures.map((item1, index) => {
            const arr = this.studyFeature.filter((item:any) => item1.featureTypeId === item.featureTypeId);
            if (arr && arr.length) {
              this.studyFeatures().at(index).patchValue({
                featureValueId: arr[0].featureValueId
              })
            }
          })
        }    
      }
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
      this.toastr.error(error.error.title);
    })
  }
  getFeature() {
    const getFeatureType$ = this.studyService.getFeatureType();
    const getFeatureValue$ = this.studyService.getFeatureValue();
    this.spinner.show();
    const combine$ = combineLatest([getFeatureType$, getFeatureValue$]).subscribe(([featureType, featureValue] : [any, any]) => {
      this.spinner.hide();
      if (featureType.data) {
        this.featureTypes = featureType.data;
      }
      if (featureValue.data) {
        this.featureValuesAll = featureValue.data;
      }
      this.featureArrayFormation();
    }, error => {
      this.spinner.hide();
      this.toastr.error(error.error.title);
    })
  }
  featureArrayFormation() {
    this.featureInterventional = this.featureTypes.filter((item: any) => item.context === 'interventional');
    this.featureObservational = this.featureTypes.filter((item: any) => item.context === 'observational');
    if (this.form.value.studyFeatures) {
      (this.form.get('studyFeatures') as FormArray).clear()
    }
    console.log(this.form.get('studyFeatures') as FormArray);
    if (this.selectedStudyType === 'interventional') {
      this.featureInterventional.map((item1, index) => {
        this.featureValInter[index] = this.featureValuesAll.filter((item: any) => item.featureTypeId === item1.id);
        this.studyFeatures().push(this.newStudyFeature(item1.id));
      });
    }
    if (this.selectedStudyType === 'observational') {
      this.featureObservational.map((item2, index) => {
        this.featureValObe[index] = this.featureValuesAll.filter((item:any) => item.featureTypeId === item2.id);
        this.studyFeatures().push(this.newStudyFeature(item2.id));
      })
    }
  }
  addFeature() {
    this.spinner.show();
    const payload = JSON.parse(JSON.stringify(this.form.value.studyFeatures)).map(item =>{
      item.sdSid = this.sdSid;
      delete item.id;
      return item;
    });
    console.log('payload ', payload);
    payload.map((item: any) => {
      this.studyService.addStudyFeature(this.sdSid, item).subscribe((res: any) => {
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
    })
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
  studyTypeChange() {
    this.featureArrayFormation();
    this.showAll = this.selectedStudyType === 'interventional' ? true : this.selectedStudyType === 'observational' ? false : true;
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
