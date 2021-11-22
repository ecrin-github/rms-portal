import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
const url = environment.baseUrl + '/context'

@Injectable({
  providedIn: 'root'
})
export class StudyService {

  constructor( private http: HttpClient) { }

  getFeatureType() {
    return this.http.get(`${url}/study-feature-types`);
  }
  getFeatureValue() {
    return this.http.get(`${url}/study-feature-categories`);
  }
  getIdentifierType() {
    return this.http.get(`${url}/identifier-types`);
  }
  getTitleType() {
    return this.http.get(`${url}/title-types`);
  }
  getTopicType() {
    return this.http.get(`${url}/topic-types`);
  }
  getReleationshiType() {
    return this.http.get(`${url}/study-relationship-types`);
  }
  getStudyType() {
    return this.http.get(`${url}/study-types`);
  }
  getStudyStatus() {
    return this.http.get(`${url}/study-statuses`);
  }
  getGenderEligibility() {
    return this.http.get(`${url}/gender-eligibility-types`);
  }
  getTimeUnits() {
    return this.http.get(`${url}/time-units`);
  }
}
