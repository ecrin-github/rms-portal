import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
const url = environment.baseUrl + '/context';

@Injectable({
  providedIn: 'root'
})
export class DataObjectService {

  constructor( private http: HttpClient) { }
  getObjectClass() {
    return this.http.get(`${url}/object-classes`);
  }
  getObjectType() {
    return this.http.get(`${url}/object-types`);
  }
  getAccessType() {
    return this.http.get(`${url}/object-access-types`);
  }
  getKeyTypes() {
    return this.http.get(`${url}/dataset-recordkey-types`);
  }
  getDeidentificationTypes() {
    return this.http.get(`${url}/dataset-deidentification-types`);
  }
  getConsentType() {
    return this.http.get(`${url}/dataset-consent-types`);
  }
  getSizeUnit() {
    return this.http.get(`${url}/size-units`);
  }
  getResourceType() {
    return this.http.get(`${url}/resource-types`);;
  }
  getLanguageCode() {
    return this.http.get(`${url}/lang-codes`);
  }
  getDateType() {
    return this.http.get(`${url}/date-types`);
  }
  getContributorType() {
    return this.http.get(`${url}/contribution-types`);
  }
  getDescriptionType() {
    return this.http.get(`${url}/description-types`);
  }
  getRelationshipType() {
    return this.http.get(`${url}/object-relationship-types`);
  }
}
