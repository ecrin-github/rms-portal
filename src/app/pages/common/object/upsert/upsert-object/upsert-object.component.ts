import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { DataObjectInterface } from 'src/app/_rms/interfaces/data-object/data-object.interface';
import { DataObjectService } from 'src/app/_rms/services/entities/data-object/data-object.service';

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

  constructor(private fb: FormBuilder, private router: Router, private objectService: DataObjectService, private spinner: NgxSpinnerService,
    private toastr: ToastrService, private activatedRoute: ActivatedRoute) {
    this.objectForm = this.fb.group({
      doi: '',
      displayTitle: '',
      version: '',
      objectClassId: '',
      objectTypeId: '',
      publicationYear: '',
      langCode: '',
      managingOrg: '',
      accessTypeId: '',
      accessDetails: '',
      accessDetailsUrl: '',
      eoscCategory: 0,
      objectDatasets: this.fb.group({
        recordKeysTypeId: '',
        recordKeysDetails: '',
        deidentTypeId: '',
        deidentDirect: false,
        deidentHipaa: false,
        deidentDates: false,
        deidentNonarr: false,
        deidentKanon: false,
        deidentDetails: '',
        consentTypeId: '',
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

  ngOnInit(): void {
    this.isEdit = this.router.url.includes('edit') ? true : false;
    this.isView = this.router.url.includes('view') ? true : false;
    if (this.isView || this.isEdit) {
      this.id = this.activatedRoute.snapshot.params.id;
      this.getObjectById(this.id);
    }
    this.getObjectClass();
    this.getObjectType();
    this.getAccessType();
    this.getKeyType();
    this.getDeidentificationType();
    this.getConsentType();
    this.getLanguageCode();
  }
  getObjectClass() {
    setTimeout(() => {
     this.spinner.show(); 
    });
    const getObjectClass$ = this.objectService.getObjectClass().subscribe((res: any) => {
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
    const getObjectType$ = this.objectService.getObjectType().subscribe((res: any) => {
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
    const getAccessType$ = this.objectService.getAccessType().subscribe((res: any) => {
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
    const getKeyType$ = this.objectService.getKeyTypes().subscribe((res: any) => {
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
    const getDeidentificationType$ = this.objectService.getDeidentificationTypes().subscribe((res: any) => {
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
    const getConsentType$ = this.objectService.getConsentType().subscribe((res:any) => {
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
    this.objectService.getLanguageCode().subscribe((res: any) => {
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
    this.objectService.getObjectById(id).subscribe((res: any) => {
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
    this.objectForm.patchValue({
      doi: this.objectData.doi,
      displayTitle: this.objectData.displayTitle,
      version: this.objectData.version,
      objectClassId: this.objectData.objectClassId,
      objectTypeId: this.objectData.objectTypeId,
      publicationYear: this.objectData.publicationYear,
      langCode: this.objectData.langCode,
      managingOrg: this.objectData.managingOrg,
      accessTypeId: this.objectData.accessTypeId,
      accessDetails: this.objectData.accessDetails,
      accessDetailsUrl: this.objectData.accessDetailsUrl,
      eoscCategory: this.objectData.eoscCategory,
      objectDatasets: {
        recordKeysTypeId: this.objectData.objectDatasets ? this.objectData.objectDatasets.recordKeysTypeId :'',
        recordKeysDetails: this.objectData.objectDatasets ? this.objectData.objectDatasets.recordKeysDetails :'',
        deidentTypeId: this.objectData.objectDatasets ? this.objectData.objectDatasets.deidentTypeId :'',
        deidentDirect: this.objectData.objectDatasets ? this.objectData.objectDatasets.deidentDirect : false,
        deidentHipaa: this.objectData.objectDatasets ? this.objectData.objectDatasets.deidentHipaa : false,
        deidentDates: this.objectData.objectDatasets ? this.objectData.objectDatasets.deidentDates : false,
        deidentNonarr: this.objectData.objectDatasets ? this.objectData.objectDatasets.deidentNonarr : false,
        deidentKanon: this.objectData.objectDatasets ? this.objectData.objectDatasets.deidentKanon : false,
        deidentDetails: this.objectData.objectDatasets ? this.objectData.objectDatasets.deidentDetails :'',
        consentTypeId: this.objectData.objectDatasets ? this.objectData.objectDatasets.consentTypeId :'',
        consentNoncommercial: this.objectData.objectDatasets ? this.objectData.objectDatasets.consentNoncommercial : false,
        consentGeogRestrict: this.objectData.objectDatasets ? this.objectData.objectDatasets.consentGeogRestrict : false,
        consentResearchType: this.objectData.objectDatasets ? this.objectData.objectDatasets.consentResearchType : false,
        consentGeneticOnly: this.objectData.objectDatasets ? this.objectData.objectDatasets.consentGeneticOnly : false,
        consentNoMethods: this.objectData.objectDatasets ? this.objectData.objectDatasets.consentNoMethods : false,
        consentDetails: this.objectData.objectDatasets ? this.objectData.objectDatasets.consentDetails :'',
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
  getInstance(event) {
    this.objectForm.patchValue({
      objectInstances: event.data
    })
    this.count +=1;
    setTimeout(() => {
     this.initiateEmit = event.isEmit; 
    });
    if (this.count === 9) {
      this.onSave();
    }
  }
  getTitle(event) {
    this.objectForm.patchValue({
      objectTitles: event.data
    })
    this.count += 1;
    if (this.count === 9) {
      this.onSave();
    }
  }
  getDate(event) {
    this.objectForm.patchValue({
      objectDates: event.data
    })
    this.count += 1;
    if (this.count === 9) {
      this.onSave();
    }
  }
  getContributor(event) {
    this.objectForm.patchValue({
      objectContributors: event.data
    })
    this.count += 1;
    if (this.count === 9) {
      this.onSave();
    }
  }
  getTopic(event) {
    this.objectForm.patchValue({
      objectTopics: event.data
    })
    this.count += 1;
    if (this.count === 9) {
      this.onSave();
    }
  }
  getIdentifier(event) {
    this.objectForm.patchValue({
      objectIdentifiers: event.data
    })
    this.count += 1;
    if (this.count === 9) {
      this.onSave();
    }
  }
  getDescription(event) {
    this.objectForm.patchValue({
      objectDescriptions: event.data
    })
    this.count += 1;
    if (this.count === 9) {
      this.onSave();
    }
  }
  getRight(event) {
    this.objectForm.patchValue({
      objectRights: event.data
    })
    this.count += 1;
    if (this.count === 9) {
      this.onSave();
    }
  }
  getRelation(event) {
    this.objectForm.patchValue({
      objectRelationships: event.data
    })
    this.count += 1;
    if (this.count === 9) {
      this.onSave();
    }
  }
  onClick() {
    this.initiateEmit = true;
  }
  onSave() {
    console.log(this.objectForm.value);
    if (this.objectForm.valid) {
      const payload = this.objectForm.value;
      payload.objectDatasets.deidentDirect = payload.objectDatasets.deidentDirect === 'true' ? true : false;
      payload.objectDatasets.deidentHipaa = payload.objectDatasets.deidentHipaa === 'true' ? true : false;
      payload.objectDatasets.deidentDates = payload.objectDatasets.deidentDates === 'true' ? true : false;
      payload.objectDatasets.deidentNonarr = payload.objectDatasets.deidentNonarr === 'true' ? true : false;
      payload.objectDatasets.deidentKanon = payload.objectDatasets.deidentKanon === 'true' ? true : false;
      payload.objectDatasets.consentNoncommercial = payload.objectDatasets.consentNoncommercial === 'true' ? true : false;
      payload.objectDatasets.consentGeogRestrict = payload.objectDatasets.consentGeogRestrict === 'true' ? true : false;
      payload.objectDatasets.consentResearchType = payload.objectDatasets.consentResearchType === 'true' ? true : false;
      payload.objectDatasets.consentGeneticOnly = payload.objectDatasets.consentGeneticOnly === 'true' ? true : false;
      payload.objectDatasets.consentNoMethods = payload.objectDatasets.consentNoMethods === 'true' ? true : false;
      if (this.isEdit) {
        payload.id = this.id;
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
          } else {
            this.toastr.error(res.messages[0]);
          }
        }, error => {
          this.spinner.hide();
          this.toastr.error(error.error.title);
        })
      } else {
        this.objectService.addDataObject(payload).subscribe((res: any) => {
          this.spinner.hide();
          if (res.statusCode === 200) {
            this.toastr.success('Data Object added successfully');
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
    const objectTypeArray: any = this.objectClass.filter((type: any) => type.id === id);
    return objectTypeArray && objectTypeArray.length ? objectTypeArray[0].name : '';
  }
  findAccessType(id) {
    const accessTypeArray: any = this.accessType.filter((type: any) => type.id === id);
    return accessTypeArray && accessTypeArray.length ? accessTypeArray[0].name : '';
  }
  findKeyType(id) {
    const keyTypeArray: any = this.keyType.filter((type: any) => type.id === id);
    return keyTypeArray && keyTypeArray.length ? keyTypeArray[0].name : '';
  }
  findDeidentificationType(id) {
    const deidentificationArray: any = this.deidentificationType.filter((type: any) => type.id === id);
    return deidentificationArray && deidentificationArray.length ? deidentificationArray[0].name : '';
  }
  findConsentType(id) {
    const consentTypeArray: any = this.consentType.filter((type: any) => type.id === id);
    return consentTypeArray && consentTypeArray.length ?consentTypeArray[0].name : '';
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
