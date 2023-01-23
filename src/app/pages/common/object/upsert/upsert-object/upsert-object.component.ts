import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { DataObjectInterface } from 'src/app/_rms/interfaces/data-object/data-object.interface';
import { CommonLookupService } from 'src/app/_rms/services/entities/common-lookup/common-lookup.service';
import { DataObjectService } from 'src/app/_rms/services/entities/data-object/data-object.service';
import { JsonGeneratorService } from 'src/app/_rms/services/entities/json-generator/json-generator.service';
import { ListService } from 'src/app/_rms/services/entities/list/list.service';
import { ObjectLookupService } from 'src/app/_rms/services/entities/object-lookup/object-lookup.service';
import { PdfGeneratorService } from 'src/app/_rms/services/entities/pdf-generator/pdf-generator.service';

@Component({
  selector: 'app-upsert-object',
  templateUrl: './upsert-object.component.html',
  styleUrls: ['./upsert-object.component.scss']
})
export class UpsertObjectComponent implements OnInit {
  public isCollapsed: boolean = true;
  objectForm: FormGroup;
  isEdit: boolean = false;
  isView: boolean = false;
  objectClass: [] = [];
  objectType: [] = [];
  accessType: [] = [];
  keyType: [] = [];
  deidentificationType: [] = [];
  consentType: [] = [];
  languageCode: [] = [];
  id: any;
  objectData: DataObjectInterface;
  subscription: Subscription = new Subscription();
  initiateEmit: boolean = false;
  count = 0;
  showDatasetKey: boolean = false;
  showTopic: boolean = false;
  showIdentifier: boolean = false;
  showDescription: boolean = false;
  sticky: boolean = false;
  EoscCategory = ['0', '1', '2', '3'];
  studyList: [] = [];

  constructor(private fb: FormBuilder, private router: Router, private commonLookupService: CommonLookupService, private objectLookupService: ObjectLookupService, private objectService: DataObjectService, private spinner: NgxSpinnerService,
    private toastr: ToastrService, private activatedRoute: ActivatedRoute, private listService: ListService, private pdfGenerator: PdfGeneratorService, private jsonGenerator: JsonGeneratorService) {
    this.objectForm = this.fb.group({
      SdSid: '',
      doi: '',
      displayTitle: '',
      version: '',
      objectClassId: null,
      objectTypeId: null,
      publicationYear: null,
      langCode: '',
      managingOrg: '',
      accessTypeId: null,
      accessDetails: '',
      accessDetailsUrl: '',
      eoscCategory: 0,
      objectDatasets: this.fb.group({
        recordKeysTypeId: null,
        recordKeysDetails: '',
        deidentTypeId: null,
        deidentDirect: false,
        deidentHipaa: false,
        deidentDates: false,
        deidentNonarr: false,
        deidentKanon: false,
        deidentDetails: '',
        consentTypeId: null,
        consentNoncommercial: false,
        consentGeogRestrict: false,
        consentResearchType: false,
        consentGeneticOnly: false,
        consentNoMethods: false,
        consentDetails: '',
      }),
      objectInstances: [],
      objectTitles: [],
      objectDates: [],
      objectContributors: [],
      objectTopics: [],
      objectIdentifiers: [],
      objectDescriptions: [],
      objectRights: [],
      objectRelationships: [],
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
    this.getStudyList();
    this.getObjectClass();
    this.getObjectType();
    this.getAccessType();
    this.getKeyType();
    this.getDeidentificationType();
    this.getConsentType();
    this.getLanguageCode();
    if (this.isView || this.isEdit) {
      this.id = this.activatedRoute.snapshot.params.id;
      this.getObjectById(this.id);
    }
  }
  getStudyList() {
    this.spinner.show();
    this.listService.getStudyList().subscribe((res: any) => {
      this.spinner.hide();
      if (res && res.data) {
        this.studyList = res.data;
      }
    }, error => {
      this.toastr.error(error.error.title);
      this.spinner.hide();
    })
  }
  customSearchFn(term: string, item) {
    term = term.toLocaleLowerCase();
    return item.sdSid.toLocaleLowerCase().indexOf(term) > -1 || item.displayTitle.toLocaleLowerCase().indexOf(term) > -1;
  }
  getObjectClass() {
    setTimeout(() => {
     this.spinner.show(); 
    });
    const getObjectClass$ = this.objectLookupService.getObjectClasses().subscribe((res: any) => {
      this.spinner.hide();
      if(res.data) {
        this.objectClass = res.data;
      }
    }, error => {
      this.spinner.hide();
      this.toastr.error(error.error.title);
    });
    this.subscription.add(getObjectClass$);
  }
  getObjectType() {
    setTimeout(() => {
     this.spinner.show(); 
    });
    const getObjectType$ = this.objectLookupService.getObjectTypes().subscribe((res: any) => {
      this.spinner.hide();
      if (res.data) {
        this.objectType = res.data;
      }
    }, error => {
      this.spinner.hide();
      this.toastr.error(error.error.title);
    });
    this.subscription.add(getObjectType$);
  }
  getAccessType() {
    setTimeout(() => {
     this.spinner.show(); 
    });
    const getAccessType$ = this.objectLookupService.getAccessTypes().subscribe((res: any) => {
      this.spinner.hide();
      if(res.data) {
        this.accessType = res.data;
      }
    }, error => {
      this.spinner.hide();
      this.toastr.error(error.error.title);
    });
    this.subscription.add(getAccessType$);
  }
  getKeyType() {
    setTimeout(() => {
     this.spinner.show(); 
    });
    const getKeyType$ = this.objectLookupService.getRecordKeyTypes().subscribe((res: any) => {
      this.spinner.hide();
      if (res.data) {
        this.keyType = res.data;
      }
    }, error => {
      this.spinner.hide();
      this.toastr.error(error.error.title);
    });
    this.subscription.add(getKeyType$);
  }
  getDeidentificationType() {
    setTimeout(() => {
     this.spinner.show(); 
    });
    const getDeidentificationType$ = this.objectLookupService.getDeidentificationTypes().subscribe((res: any) => {
      this.spinner.hide();
      if (res.data) {
        this.deidentificationType = res.data
      }
    }, error => {
      this.spinner.hide();
      this.toastr.error(error.error.title);
    });
    this.subscription.add(getDeidentificationType$);
  }
  getConsentType() {
    setTimeout(() => {
     this.spinner.show(); 
    });
    const getConsentType$ = this.objectLookupService.getConsentTypes().subscribe((res:any) => {
      this.spinner.hide();
      if(res.data) {
        this.consentType = res.data;
      }
    }, error => {
      this.spinner.hide();
      this.toastr.error(error.error.title);
    });
    this.subscription.add(getConsentType$);
  }
  getLanguageCode() {
    setTimeout(() => {
     this.spinner.show(); 
    });
    this.commonLookupService.getLanguageCodes('en').subscribe((res: any) => {
      this.spinner.hide();
      if (res && res.data) {
        this.languageCode = res.data;
      }
    }, error => {
      this.spinner.hide();
      this.toastr.error(error.error.title);
    })
  }
  getObjectById(id) {
    setTimeout(() => {
     this.spinner.show();
    });
    this.objectService.getDataObjectById(id).subscribe((res: any) => {
      this.spinner.hide();
      if(res && res.data && res.data.length) {
        this.objectData = res.data[0];
        this.patchObjectForm();
      }
    }, error => {
      this.spinner.hide();
      this.toastr.error(error.error.title);
    })
  }
  patchObjectForm() {
    const arr: any = this.objectClass.filter((item:any) => item.name === 'Dataset');
    this.showDatasetKey = this.objectData.coreObject.objectClassId === arr[0].id ? true : false;
    const arrType: any = this.objectType.filter((item: any) => item.name.toLowerCase() === 'publication list' || item.name.toLowerCase() === 'journal article' || item.name.toLowerCase() === 'working paper / pre-print');
    arrType.map(item => {
      if (item.id === this.objectData.coreObject.objectTypeId) {
        this.showTopic = true;
        return;
      }
    });
    this.objectForm.patchValue({
      SdSid: this.objectData.coreObject.sdSid,
      doi: this.objectData.coreObject.doi,
      displayTitle: this.objectData.coreObject.displayTitle,
      version: this.objectData.coreObject.version,
      objectClassId: this.objectData.coreObject.objectClassId,
      objectTypeId: this.objectData.coreObject.objectTypeId,
      publicationYear: this.objectData.coreObject.publicationYear,
      langCode: this.objectData.coreObject.langCode,
      managingOrg: this.objectData.coreObject.managingOrg,
      accessTypeId: this.objectData.coreObject.accessTypeId,
      accessDetails: this.objectData.coreObject.accessDetails,
      accessDetailsUrl: this.objectData.coreObject.accessDetailsUrl,
      eoscCategory: this.objectData.coreObject.eoscCategory,
      objectDatasets: {
        recordKeysTypeId: this.objectData.objectDatasets[0] ? this.objectData.objectDatasets[0].recordKeysTypeId :'',
        recordKeysDetails: this.objectData.objectDatasets[0] ? this.objectData.objectDatasets[0].recordKeysDetails :'',
        deidentTypeId: this.objectData.objectDatasets[0] ? this.objectData.objectDatasets[0].deidentTypeId :'',
        deidentDirect: this.objectData.objectDatasets[0] ? this.objectData.objectDatasets[0].deidentDirect : false,
        deidentHipaa: this.objectData.objectDatasets[0] ? this.objectData.objectDatasets[0].deidentHipaa : false,
        deidentDates: this.objectData.objectDatasets[0] ? this.objectData.objectDatasets[0].deidentDates : false,
        deidentNonarr: this.objectData.objectDatasets[0] ? this.objectData.objectDatasets[0].deidentNonarr : false,
        deidentKanon: this.objectData.objectDatasets[0] ? this.objectData.objectDatasets[0].deidentKanon : false,
        deidentDetails: this.objectData.objectDatasets[0] ? this.objectData.objectDatasets[0].deidentDetails :'',
        consentTypeId: this.objectData.objectDatasets[0] ? this.objectData.objectDatasets[0].consentTypeId :'',
        consentNoncommercial: this.objectData.objectDatasets[0] ? this.objectData.objectDatasets[0].consentNoncommercial : false,
        consentGeogRestrict: this.objectData.objectDatasets[0] ? this.objectData.objectDatasets[0].consentGeogRestrict : false,
        consentResearchType: this.objectData.objectDatasets[0] ? this.objectData.objectDatasets[0].consentResearchType : false,
        consentGeneticOnly: this.objectData.objectDatasets[0] ? this.objectData.objectDatasets[0].consentGeneticOnly : false,
        consentNoMethods: this.objectData.objectDatasets[0] ? this.objectData.objectDatasets[0].consentNoMethods : false,
        consentDetails: this.objectData.objectDatasets[0] ? this.objectData.objectDatasets.consentDetails :'',
      },
      objectInstances: this.objectData.objectInstances ? this.objectData.objectInstances : [],
      objectTitles: this.objectData.objectTitles ? this.objectData.objectTitles : [],
      objectDates: this.objectData.objectDates ? this.objectData.objectDates : [],
      objectContributors: this.objectData.objectContributors ? this.objectData.objectContributors : [],
      objectTopics: this.objectData.objectTopics ? this.objectData.objectTopics : [],
      objectIdentifiers: this.objectData.objectIdentifiers ? this.objectData.objectIdentifiers : [],
      objectDescriptions: this.objectData.objectDescriptions ? this.objectData.objectDescriptions : [],
      objectRights: this.objectData.objectRights ? this.objectData.objectRights : [],
      objectRelationships: this.objectData.objectRelationships ? this.objectData.objectRelationships : []
    })
  }
  onSave() {
    if (localStorage.getItem('updateObjectList')) {
      localStorage.removeItem('updateObjectList');
    }
    if (this.objectForm.valid) {
      const payload = JSON.parse(JSON.stringify(this.objectForm.value));
      payload.objectDatasets.deidentDirect = payload.objectDatasets.deidentDirect;
      payload.objectDatasets.deidentHipaa = payload.objectDatasets.deidentHipaa;
      payload.objectDatasets.deidentDates = payload.objectDatasets.deidentDates;
      payload.objectDatasets.deidentNonarr = payload.objectDatasets.deidentNonarr;
      payload.objectDatasets.deidentKanon = payload.objectDatasets.deidentKanon;
      payload.objectDatasets.consentNoncommercial = payload.objectDatasets.consentNoncommercial;
      payload.objectDatasets.consentGeogRestrict = payload.objectDatasets.consentGeogRestrict;
      payload.objectDatasets.consentResearchType = payload.objectDatasets.consentResearchType;
      payload.objectDatasets.consentGeneticOnly = payload.objectDatasets.consentGeneticOnly;
      payload.objectDatasets.consentNoMethods = payload.objectDatasets.consentNoMethods;
      payload.objectTypeId = payload.objectTypeId ? payload.objectTypeId : null;
      payload.objectClassId = payload.objectClassId ? payload.objectClassId : null;
      payload.accessTypeId = payload.accessTypeId ? payload.accessTypeId : null;
      payload.accessTypeId = payload.accessTypeId ? payload.accessTypeId : null;
      payload.objectDatasets.recordKeysTypeId = payload.objectDatasets.recordKeysTypeId ? payload.objectDatasets.recordKeysTypeId : null;
      payload.objectDatasets.deidentTypeId = payload.objectDatasets.deidentTypeId ? payload.objectDatasets.deidentTypeId : null;
      payload.objectDatasets.consentTypeId = payload.objectDatasets.consentTypeId ? payload.objectDatasets.consentTypeId : null;
      if (this.isEdit) {
        payload.id = this.objectData.id;
        payload.sdOid = this.id;
        if (this.objectData.objectDatasets) {
          payload.objectDatasets['id'] = this.objectData.objectDatasets['id'];
          payload.objectDatasets['sdOid'] = this.objectData.objectDatasets['sdOid'];
        }
        this.spinner.show();
        this.objectService.editDataObject(this.id, payload).subscribe((res: any) => {
          this.spinner.hide();
          if (res.statusCode === 200) {
            this.toastr.success('Data Object updated successfully');
            localStorage.setItem('updateObjectList', 'true');
            this.getObjectById(this.id);
          } else {
            this.toastr.error(res.messages[0]);
          }
        }, error => {
          this.spinner.hide();
          this.toastr.error(error.error.title);
        })
      } else {
        this.objectService.addDataObject(payload.SdSid, payload).subscribe((res: any) => {
          this.spinner.hide();
          if (res.statusCode === 200) {
            this.toastr.success('Data Object added successfully');
            localStorage.setItem('updateObjectList', 'true');
            this.close();
          } else {
            this.toastr.error(res.messages[0]);
          }
        }, error => {
          console.log(error.error.title)
          this.spinner.hide();
          this.toastr.error(error.error.title);
        })
      }
    }
    this.count = 0;
  }
  findObjectClass(id) {
    const objectClassArray: any = this.objectClass.filter((type: any) => type.id === id);
    return objectClassArray && objectClassArray.length ? objectClassArray[0].name : '';
  }
  findobjectType(id) {
    const objectTypeArray: any = this.objectType.filter((type: any) => type.id === id);
    return objectTypeArray && objectTypeArray.length ? objectTypeArray[0].name : '';
  }
  findAccessType(id) {
    const accessTypeArray: any = this.accessType.filter((type: any) => type.id === id);
    return accessTypeArray && accessTypeArray.length ? accessTypeArray[0].name : '';
  }
  findKeyType(id) {
    const keyTypeArray: any = this.keyType.filter((type: any) => type.id === id);
    return keyTypeArray && keyTypeArray.length ? keyTypeArray[0].name : 'None';
  }
  findDeidentificationType(id) {
    const deidentificationArray: any = this.deidentificationType.filter((type: any) => type.id === id);
    return deidentificationArray && deidentificationArray.length ? deidentificationArray[0].name : 'None';
  }
  findConsentType(id) {
    const consentTypeArray: any = this.consentType.filter((type: any) => type.id === id);
    return consentTypeArray && consentTypeArray.length ?consentTypeArray[0].name : 'None';
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  close() {
    window.close();
  }
  onChange() {
    const arr: any = this.objectClass.filter((item:any) => item.name.toLowerCase() === 'dataset');
    this.showDatasetKey = parseInt(this.objectForm.value.objectClassId) === arr[0].id ? true : false;
  }
  onTypeChange() {
    this.showTopic = false;
    const arrType: any = this.objectType.filter((item: any) => item.name.toLowerCase() === 'publication list' || item.name.toLowerCase() === 'journal article' || item.name.toLowerCase() === 'working paper / pre-print');
    arrType.map(item => {
      if (item.id === parseInt(this.objectForm.value.objectTypeId)) {
        this.showTopic = true;
        return
      }
    });
  }
  printPdf() {
    this.pdfGenerator.objectPdfGenerator(this.objectData);
  }
}
