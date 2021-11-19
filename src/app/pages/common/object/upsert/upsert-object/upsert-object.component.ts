import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upsert-object',
  templateUrl: './upsert-object.component.html',
  styleUrls: ['./upsert-object.component.scss']
})
export class UpsertObjectComponent implements OnInit {
  public isCollapsed: boolean = true;
  objectForm: FormGroup;
  isEdit: boolean = false;
  isView: boolean = false

  constructor(private fb: FormBuilder, private router: Router) {
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
  }

  onSave() {
    console.log(this.objectForm.value);
  }

}
