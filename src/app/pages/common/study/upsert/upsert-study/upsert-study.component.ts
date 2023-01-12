import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { StudyInterface } from 'src/app/_rms/interfaces/study/study.interface';
import { JsonGeneratorService } from 'src/app/_rms/services/entities/json-generator/json-generator.service';
import { PdfGeneratorService } from 'src/app/_rms/services/entities/pdf-generator/pdf-generator.service';
import { StudyLookupService } from 'src/app/_rms/services/entities/study-lookup/study-lookup.service';
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
  isAdd: boolean = false;
  studyTypes: [] = [];
  studyStatuses: [] = [];
  genderEligibility: [] = [];
  timeUnits: [] =[];
  trialRegistries: [] = [];
  subscription: Subscription = new Subscription();
  isSubmitted: boolean = false;
  id: any;
  studyData: StudyInterface;
  studyTypeView: any;
  studyStatusView: any;
  studyGenderView: any;
  studyMinAgeView: any;
  studyMaxAgeView: any;
  count = 0;
  publicTitle: string = '';
  monthValues = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  sticky: boolean = false;
  studyType: string = '';
  addType: string;
  registryId: number;
  trialId: string;

  constructor(private fb: FormBuilder, private router: Router, private studyLookupService: StudyLookupService, private studyService: StudyService, private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService, private toastr: ToastrService, private pdfGenerator: PdfGeneratorService, private jsonGenerator: JsonGeneratorService) {
    this.studyForm = this.fb.group({
      sdSid: '',
      displayTitle: ['', Validators.required],
      briefDescription: '',
      dataSharingStatement: '',
      studyTypeId: null,
      studyStatusId: null,
      studyGenderEligId: null,
      studyEnrolment: '',
      studyStartMonth: null,
      studyStartYear: null,
      minAge: null,
      minAgeUnitsId: null,
      maxAge: null,
      maxAgeUnitsId: null,
      studyIdentifiers: [],
      studyTitles: [],
      studyFeatures: [],
      studyTopics: [],
      studyRelationships: [],
      studyContributors: []
    });
  }
  @HostListener('window:scroll', ['$event'])
  onScroll() {
    const navbar = document.getElementById('navbar');
    const sticky = navbar.offsetTop;
    if (window.pageYOffset >= sticky) {
      navbar.classList.add('sticky');
      this.sticky = true;
    } else {
      navbar.classList.remove('sticky');
      this.sticky = false;
    }
  }


  ngOnInit(): void {
    this.isEdit = this.router.url.includes('edit') ? true : false;
    this.isView = this.router.url.includes('view') ? true : false;
    this.isAdd = this.router.url.includes('add') ? true : false;
    this.getStudyType();
    this.getStudyStatus();
    this.getGenderEligibility();
    this.getTimeUnits();

    if (this.isEdit || this.isView) {
      this.id = this.activatedRoute.snapshot.params.id;
      this.getStudyById(this.id);
    }
    this.activatedRoute.queryParams.subscribe(params => {
      this.addType = params.type;
    })
    if (this.addType === 'usingTrialId') {
      this.getTrialRegistries();
    }
  }
  get g() { return this.studyForm.controls; }
  getStudyType() {
    setTimeout(() => {
      this.spinner.show(); 
    });
    const getStudyType$ = this.studyLookupService.getStudyTypes().subscribe((res:any) => {
      this.spinner.hide();
      if(res.data) {
        this.studyTypes = res.data;
      }
      if (this.isView) {
        setTimeout(() => {
          const studyArray = this.studyTypes.filter((type: any) => type.id === this.studyForm.value.studyTypeId);
          this.studyTypeView = studyArray && studyArray.length ? studyArray[0] : { name: '' };
        });
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
    const getStudyStatus$ = this.studyLookupService.getStudyStatuses().subscribe((res: any) => {
      this.spinner.hide();
      if(res.data) {
        this.studyStatuses = res.data;
      }
      if (this.isView) {
        setTimeout(() => {
          const statusArray = this.studyStatuses.filter((type: any) => type.id === this.studyData.studyStatusId);
          this.studyStatusView = statusArray && statusArray.length ? statusArray[0] : { name: '' }
        });
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
    const getGenderEligibility$ = this.studyLookupService.getGenderEligibilities().subscribe((res: any) => {
      this.spinner.hide();
      if (res.data) {
        this.genderEligibility = res.data;
      }
      if (this.isView) {
        setTimeout(() => {
          const genderArray = this.genderEligibility.filter((type: any) => type.id === this.studyForm.value.studyGenderEligId);
          this.studyGenderView = genderArray && genderArray.length ? genderArray[0] : { name: '' };
        });
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
    const getTimeUnits$ = this.studyLookupService.getTimeUnits().subscribe((res: any) => {
      this.spinner.hide();
      if(res.data) {
        this.timeUnits = res.data;
      }
      if (this.isView) {
        setTimeout(() => {
          const minAgeArray = this.timeUnits.filter((type: any) => type.id === this.studyForm.value.minAgeUnitsId);
          this.studyMinAgeView = minAgeArray && minAgeArray.length ? minAgeArray[0] : { name: '' };
          const maxAgeArray = this.timeUnits.filter((type: any) => type.id === this.studyForm.value.maxAgeUnitsId);
          this.studyMaxAgeView = maxAgeArray && maxAgeArray.length ? maxAgeArray[0] : { name: '' };
        });
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
  getTrialRegistries() {
    this.studyLookupService.getTrialRegistries().subscribe((res: any) => {
      if (res && res.data) {
        this.trialRegistries = res.data;
      }
    }, error => {
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
      studyStartYear: this.studyData.studyStartYear ? new Date(`01/01/${this.studyData.studyStartYear}`) : '',
      studyStartMonth: this.studyData.studyStartMonth,
      minAge: this.studyData.minAge,
      minAgeUnitsId: this.studyData.minAgeUnitsId,
      maxAge: this.studyData.maxAge,
      maxAgeUnitsId: this.studyData.maxAgeUnitsId,
      studyIdentifiers: this.studyData.studyIdentifiers ? this.studyData.studyIdentifiers : [],
      studyTitles: this.studyData.studyTitles ? this.studyData.studyTitles : [],
      studyFeatures: this.studyData.studyFeatures ? this.studyData.studyFeatures : [],
      studyTopics: this.studyData.studyTopics ? this.studyData.studyTopics : [],
      studyRelationships: this.studyData.studyRelationships ? this.studyData.studyRelationships : [],
      studyContributors: this.studyData.studyContributors ? this.studyData.studyContributors : [],

    });
    this.studyTypeChange();
  }
  onSave() {
    if (localStorage.getItem('updateStudyList')) {
      localStorage.removeItem('updateStudyList');
    }
    if (this.addType === 'manual') {
      this.isSubmitted = true;
      if (this.studyForm.valid) {
        const payload = JSON.parse(JSON.stringify(this.studyForm.value));
        this.spinner.show();
        if (this.isEdit) {
          payload.id = this.studyData.id;
          payload.sdSid = this.id;
          payload.studyStartYear = this.studyForm.value.studyStartYear ? this.studyForm.value.studyStartYear.getFullYear() : null;
          this.studyService.editStudy(this.id, payload).subscribe((res: any) => {
            this.spinner.hide();
            if (res.statusCode === 200) {
              this.toastr.success('Study Details updated successfully');
              localStorage.setItem('updateStudyList', 'true');
              this.getStudyById(this.id);
            } else {
              this.toastr.error(res.messages[0]);
            }
          }, error => {
            this.spinner.hide();
            this.toastr.error(error.error.title);
          })
        } else {
          payload.studyStartYear = this.studyForm.value.studyStartYear ? this.studyForm.value.studyStartYear.getFullYear() : null;
          this.studyService.addStudy(payload.sdSid, payload).subscribe((res: any) => {
            this.spinner.hide();
            if (res.statusCode === 200) {
              this.toastr.success('Study Detail added successfully');
              localStorage.setItem('updateStudyList', 'true');
              this.close();
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
    if (this.addType === 'usingTrialId') {
      this.spinner.show();
      this.studyService.getFullStudyFromMdr(this.registryId, this.trialId).subscribe((res: any) => {
        if (res.statusCode === 200) {
          this.toastr.success('Study imported successfully. you will be redirected shortly');
          localStorage.setItem('updateStudyList', 'true');
          setTimeout(() => {
            this.spinner.hide();
            window.close();
            this.router.navigate([]).then((result) => {
              window.open(`studies/${res?.data[0]?.coreStudy?.sdSid}/edit`, '_blank');
            });
          }, 2000);
        } else {
          this.spinner.hide();
          this.toastr.error(res.messages[0]);
        }
      }, error => {
        this.spinner.hide();
        this.toastr.error(error.error.title);
      })
    }
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  close() {
    window.close();
  }
  onChange() {
    this.publicTitle = this.studyForm.value.displayTitle;
  }
  studyTypeChange() {
    const arrInterventional:any = this.studyTypes.filter((item: any) => item.name.toLowerCase() === 'interventional');
    const arrObservational:any = this.studyTypes.filter((item: any) => item.name.toLowerCase() === 'observational');
    this.studyType = parseInt(this.studyForm.value.studyTypeId) === arrInterventional[0].id ? 'interventional' : parseInt(this.studyForm.value.studyTypeId) === arrObservational[0].id ? 'observational': ''
  }
  print() {
    this.studyService.getFullStudyById(this.id).subscribe((res: any) => {
      if (res && res.data) {
        this.pdfGenerator.studyPdfGenerator(res.data[0]);
      }
    }, error => {
      this.toastr.error(error.error.title);
    })
  }
  jsonExport() {
    this.studyService.getFullStudyById(this.id).subscribe((res: any) => {
      if (res && res.data) {
        this.jsonGenerator.jsonGenerator(res.data[0], 'study');
      }
    }, error => {
      this.toastr.error(error.error.title);
    })
  }
}
