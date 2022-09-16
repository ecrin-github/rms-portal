import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const base = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class CommonLookupService {

  constructor( private http: HttpClient) { }

  getTopicTypes() {
    return this.http.get(`${base}/lookup/topic-types/simple`);
  }
  getTopicVocabularies() {
    return this.http.get(`${base}/lookup/topic-vocabularies/simple`);
  }
  getContributorTypes() {
    return this.http.get(`${base}/lookup/contribution-types/simple`);
  }
  getIndividualContributorTypes() {
    return this.http.get(`${base}/lookup/contribution-types-for-individuals/simple`);
  }
  getOrganisationContributorTypes() {
    return this.http.get(`${base}/lookup/contribution-types-for-organisations/simple`);
  }

  getOrganizationList() {
    return this.http.get(`${base}/context/organisations`);
  }

  getLanguageCodes() {
    return this.http.get(`${base}/lookup/major-langs`);
  }
}