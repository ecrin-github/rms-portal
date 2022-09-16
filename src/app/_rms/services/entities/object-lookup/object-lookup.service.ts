import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const base = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class ObjectLookupService {

  constructor( private http: HttpClient) { }

  // lookups
  getObjectClasses() {
    return this.http.get(`${base}/lookup/object-classes/simple`);
  }
  getObjectTypes() {
    return this.http.get(`${base}/lookup/object-types/simple`);
  }
  getObjectTitleTypes() {
    return this.http.get(`${base}/lookup/title-types-for-objects/simple`);
  }
  getAccessTypes() {
    return this.http.get(`${base}/lookup/object-access-types/simple`);
  }
  getRecordKeyTypes() {
    return this.http.get(`${base}/lookup/dataset-recordkey-types/simple`);
  }
  getDeidentificationTypes() {
    return this.http.get(`${base}/lookup/dataset-deidentification-types/simple`);
  }
  getConsentTypes() {
    return this.http.get(`${base}/lookup/dataset-consent-types/simple`);
  }
  getSizeUnits() {
    return this.http.get(`${base}/lookup/size-units/simple`);
  }
  getResourceTypes() {
    return this.http.get(`${base}/lookup/resource-types/simple`);
  }
  getDateTypes() {
    return this.http.get(`${base}/lookup/date-types/simple`);
  }
  getDescriptionTypes() {
    return this.http.get(`${base}/lookup/description-types/simple`);
  }
  getObjectIdentifierTypes() {
    return this.http.get(`${base}/lookup/identifier-types-for-objects/simple`);
  }
  getObjectRelationshipTypes() {
    return this.http.get(`${base}/lookup/object-relationship-types/simple`);
  }
}