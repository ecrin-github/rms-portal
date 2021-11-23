import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
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
  subscription: Subscription = new Subscription();


  constructor(private fb: FormBuilder, private router: Router, private objectService: DataObjectService) {
    this.objectForm = this.fb.group({
      doi: '',
      displayTitle: '',
      version: '',
      objectClass: '',
      objectType: '',
      publicationYear: 0,
      langCode: '',
      managingOrganisation: '',
      accessType: '',
      accessDetails: this.fb.group({
        description: '',
        url: ''
      }),
      eoscCategory: 0,
      datasetRecordKeys: this.fb.group({
        keysTypes: '',
        keysDetails: ''
      }),
      datasetDeidentLevel: this.fb.group({
        deidentType: '',
        deidentDirect: false,
        deidentHipaa: false,
        deidentDates: false,
        deidentNonarr: false,
        deidentKanon: false,
        deidentDetails: ''
      }),
      datasetConsent: this.fb.group({
        consentType: '',
        consentNoncommercial: false,
        consentGeogRestrict: false,
        consentResearchType: false,
        consentGeneticOnly: false,
        consentNoMethods: false,
        consentsDetails: '',
      }),
      objectInstances: '',
      objectTitles: '',
      objectDates: '',
      objectContributors: '',
      objectTopics: '',
      objectIdentifiers: '',
      objectDescriptions: '',
      objectRights: '',
      objectRelationships: '',
    });
  }

  ngOnInit(): void {
    this.isEdit = this.router.url.includes('edit') ? true : false;
    this.isView = this.router.url.includes('view') ? true : false;
    this.getObjectClass();
    this.getObjectType();
    this.getAccessType();
    this.getKeyType();
    this.getDeidentificationType();
    this.getConsentType();
  }
  getObjectClass() {
    const getObjectClass$ = this.objectService.getObjectClass().subscribe((res: any) => {
      if(res.data) {
        this.objectClass = res.data;
      }
    }, error => {
      console.log('error', error);
    });
    this.subscription.add(getObjectClass$);
  }
  getObjectType() {
    const getObjectType$ = this.objectService.getObjectType().subscribe((res: any) => {
      if (res.data) {
        this.objectType = res.data;
      }
    }, error => {
      console.log('error', error);
    });
    this.subscription.add(getObjectType$);
  }
  getAccessType() {
    const getAccessType$ = this.objectService.getAccessType().subscribe((res: any) => {
      if(res.data) {
        this.accessType = res.data;
      }
    }, error => {
      console.log('error', error);
    });
    this.subscription.add(getAccessType$);
  }
  getKeyType() {
    const getKeyType$ = this.objectService.getKeyTypes().subscribe((res: any) => {
      if (res.data) {
        this.keyType = res.data;
      }
    }, error => {
      console.log('error', error);
    });
    this.subscription.add(getKeyType$);
  }
  getDeidentificationType() {
    const getDeidentificationType$ = this.objectService.getDeidentificationTypes().subscribe((res: any) => {
      if (res.data) {
        this.deidentificationType = res.data
      }
    }, error => {
      console.log('error', error);
    });
    this.subscription.add(getDeidentificationType$);
  }
  getConsentType() {
    const getConsentType$ = this.objectService.getConsentType().subscribe((res:any) => {
      if(res.data) {
        this.consentType = res.data;
      }
    }, error => {
      console.log('error', error);
    });
    this.subscription.add(getConsentType$);
  }
  onSave() {
    console.log(this.objectForm.value);
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
