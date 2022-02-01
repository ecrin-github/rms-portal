import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { StudyInterface } from 'src/app/_rms/interfaces/study/study.interface';
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
  isSubmitted: boolean = false;
  id: any;
  studyData: StudyInterface;
  studyTypeView: any;
  studyStatusView: any;
  studyGenderView: any;
  studyMinAgeView: any;
  studyMaxAgeView: any;
  initiateEmit: boolean = false;
  count = 0;
  constructor(private fb: FormBuilder, private router: Router, private studyService: StudyService, private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService, private toastr: ToastrService) {
    this.studyForm = this.fb.group({
      displayTitle: '',
      briefDescription: '',
      dataSharingStatement: '',
      studyTypeId: '',
      studyStatusId: '',
      studyGenderEligId: '',
      studyEnrolment: 0,
      minAge: '',
      minAgeUnitsId: '',
      maxAge: '',
      maxAgeUnitsId: '',
      studyIdentifiers: [],
      studyTitles: [],
      studyFeatures: [],
      studyTopics: [],
      studyRelationships: [],
    });
  }

  ngOnInit(): void {
    this.isEdit = this.router.url.includes('edit') ? true : false;
    this.isView = this.router.url.includes('view') ? true : false;
    if (this.isEdit || this.isView) {
      this.id = this.activatedRoute.snapshot.params.id;
      this.getStudyById(this.id);
    } else {
      this.getStudyType();
      this.getStudyStatus();
      this.getGenderEligibility();
      this.getTimeUnits();
    }
  }
  getStudyType() {
    setTimeout(() => {
      this.spinner.show(); 
    });
    const getStudyType$ = this.studyService.getStudyType().subscribe((res:any) => {
      this.spinner.hide();
      if(res.data) {
        this.studyTypes = res.data;
      }
      if(this.isView) {
        const studyArray = this.studyTypes.filter((type: any) => type.id === this.studyForm.value.studyTypeId);
        this.studyTypeView = studyArray && studyArray.length ? studyArray[0] : {name: ''};
      }
    }, error => {
      this.spinner.hide();
      this.toastr.error(error.error.title);
    });
    this.subscription.add(getStudyType$);
  }
  getStudyStatus() {
    setTimeout(() => {
      this.spinner.show(); 
    });
    const getStudyStatus$ = this.studyService.getStudyStatus().subscribe((res: any) => {
      this.spinner.hide();
      if(res.data) {
        this.studyStatuses = res.data;
      }
      if(this.isView){
        const statusArray = this.studyStatuses.filter((type: any) => type.id === this.studyForm.value.studyStatusId);
        this.studyStatusView = statusArray && statusArray.length ? statusArray[0] : {name: ''}
      }
    }, error => {
      this.spinner.hide();
      this.toastr.error(error.error.title);
    });
    this.subscription.add(getStudyStatus$);
  }
  getGenderEligibility() {
    setTimeout(() => {
      this.spinner.show(); 
    });
    const getGenderEligibility$ = this.studyService.getGenderEligibility().subscribe((res: any) => {
      this.spinner.hide();
      if (res.data) {
        this.genderEligibility = res.data;
      }
      if(this.isView) {
        const genderArray = this.genderEligibility.filter((type: any) => type.id === this.studyForm.value.studyGenderEligId);
        this.studyGenderView = genderArray && genderArray.length ? genderArray[0] : {name: ''};
      }
    }, error => {
      this.spinner.hide();
      this.toastr.error(error.error.title);
    });
    this.subscription.add(getGenderEligibility$);
  }
  getTimeUnits() {
    setTimeout(() => {
      this.spinner.show(); 
    });
    const getTimeUnits$ = this.studyService.getTimeUnits().subscribe((res: any) => {
      this.spinner.hide();
      if(res.data) {
        this.timeUnits = res.data;
      }
      if(this.isView) {
        const minAgeArray = this.timeUnits.filter((type: any) => type.id === this.studyForm.value.minAgeUnitsId);
        this.studyMinAgeView = minAgeArray && minAgeArray.length ? minAgeArray[0] : {name: ''};
        const maxAgeArray = this.timeUnits.filter((type: any) => type.id === this.studyForm.value.maxAgeUnitsId);
        this.studyMaxAgeView = maxAgeArray && maxAgeArray.length ? maxAgeArray[0] : {name: ''};
      }
    }, error => {
      this.spinner.hide();
      this.toastr.error(error.error.title);
    });
    this.subscription.add(getTimeUnits$);
  }
  getStudyById(id) {
    setTimeout(() => {
     this.spinner.show(); 
    });
    this.studyService.getStudyById(id).subscribe((res: any) => {
      this.spinner.hide();
      if (res && res.data && res.data.length) {
        this.studyData = res.data[0];
        this.patchStudyForm();
      }
    }, error => {
      this.spinner.hide();
      this.toastr.error(error.error.title);
    })
  }
  patchStudyForm() {
    this.studyForm.patchValue({
      displayTitle: this.studyData.displayTitle,
      briefDescription: this.studyData.briefDescription,
      dataSharingStatement: this.studyData.dataSharingStatement,
      studyTypeId: this.studyData.studyTypeId,
      studyStatusId: this.studyData.studyStatusId,
      studyGenderEligId: this.studyData.studyGenderEligId,
      studyEnrolment: this.studyData.studyEnrolment,
      minAge: this.studyData.minAge,
      minAgeUnitsId: this.studyData.minAgeUnitsId,
      maxAge: this.studyData.maxAge,
      maxAgeUnitsId: this.studyData.maxAgeUnitsId,
      studyIdentifiers: this.studyData.studyIdentifiers ? this.studyData.studyIdentifiers : [],
      studyTitles: this.studyData.studyTitles ? this.studyData.studyTitles : [],
      studyFeatures: this.studyData.studyFeatures ? this.studyData.studyFeatures : [],
      studyTopics: this.studyData.studyTopics ? this.studyData.studyTopics : [],
      studyRelationships: this.studyData.studyRelationships ? this.studyData.studyRelationships : [],

    });
    this.getStudyType();
    this.getStudyStatus();
    this.getGenderEligibility();
    this.getTimeUnits();
  }
  getIdentifier(event) {
    this.studyForm.patchValue({
      studyIdentifiers: event.data
    })
    this.count += 1;
    setTimeout(() => {
      this.initiateEmit = event.isEmit;
    });
    if (this.count === 5) {
      this.onSave();
    }
  }
  getTitle(event) {
    this.studyForm.patchValue({
      studyTitles: event.data
    })
    this.count += 1;
    if (this.count === 5) {
      this.onSave();
    }
  }
  getFeature(event) {
    this.studyForm.patchValue({
      studyFeatures: event.data
    })
    this.count += 1;
    if (this.count === 5) {
      this.onSave();
    }
  }
  getTopic(event) {
    this.studyForm.patchValue({
      studyTopics: event.data
    })
    this.count += 1;
    if (this.count === 5) {
      this.onSave();
    }
  }
  getRelation(event) {
    this.studyForm.patchValue({
      studyRelationships: event.data
    })
    this.count += 1;
    if (this.count === 5) {
      this.onSave();
    }
  }
  onClick() {
    this.initiateEmit = true;
  }
  onSave() {
    this.isSubmitted = true;
    if (this.studyForm.valid) {
      const payload = JSON.parse(JSON.stringify(this.studyForm.value));
      this.spinner.show();
      if (this.isEdit) {
        payload.id = this.id;
        payload.sdSid = this.id;
        this.studyService.editStudy(this.id, payload).subscribe((res: any) => {
          this.spinner.hide();
          if (res.statusCode === 200) {
            this.toastr.success('Study Details updated successfully');
            localStorage.setItem('updateStudyList', 'true');
          } else {
            this.toastr.error(res.messages[0]);
          }
        }, error => {
          this.spinner.hide();
          this.toastr.error(error.error.title);
        })
      } else {
        this.studyService.addStudy(payload).subscribe((res: any) => {
          this.spinner.hide();
          if (res.statusCode === 200) {
            this.toastr.success('Study Detail added successfully');
            localStorage.setItem('updateStudyList', 'true');
          } else {
            this.toastr.error(res.messages[0]);
          }
        }, error => {
          this.spinner.hide();
          this.toastr.error(error.error.title);
        })
      }
    }
    this.count = 0;
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  close() {
    window.close();
  }
}
