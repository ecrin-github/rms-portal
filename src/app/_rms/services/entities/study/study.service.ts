import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
const url = environment.baseUrl + '/context';
const studyUrl = environment.baseUrl + '/metadata-management/studies';
const filterUrl = environment.baseUrl + '/metadata-management';

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
  getLanguageCode() {
    return this.http.get(`${url}/lang-codes`);
  }
  getStudy() {
    return this.http.get(`${studyUrl}`);
  }
  addStudy(payload) {
    return this.http.post(`${studyUrl}`, payload);
  }
  getStudyById(id) {
    return this.http.get(`${studyUrl}/${id}`);
  }
  editStudy(id, payload) {
    return this.http.put(`${studyUrl}/${id}`, payload);
  }
  getStudyIdentifier(id) {
    return this.http.get(`${studyUrl}/${id}/identifiers`);
  }
  addStudyIdentifier(id, payload) {
    return this.http.post(`${studyUrl}/${id}/identifiers`, payload);
  }
  editStudyIdentifier(id, sdSid, payload) {
    return this.http.put(`${studyUrl}/${sdSid}/identifiers/${id}`, payload);
  }
  getStudyTitle(id) {
    return this.http.get(`${studyUrl}/${id}/titles`);
  }
  addStudyTitle(id, payload) {
    return this.http.post(`${studyUrl}/${id}/titles`, payload);
  }
  editStudyTitle(id, sdSid, payload) {
    return this.http.put(`${studyUrl}/${sdSid}/titles/${id}`, payload);
  }
  getStudyFeature(id) {
    return this.http.get(`${studyUrl}/${id}/features`);
  }
  addStudyFeature(id, payload) {
    return this.http.post(`${studyUrl}/${id}/features`, payload);
  }
  editStudyFeature(id, sdSid, payload) {
    return this.http.put(`${studyUrl}/${sdSid}/features/${id}`, payload);
  }
  getStudyTopic(id) {
    return this.http.get(`${studyUrl}/${id}/topics`);
  }
  addStudyTopic(id, payload) {
    return this.http.post(`${studyUrl}/${id}/topics`, payload);
  }
  editStudyTopic(id, sdSid, payload) {
    return this.http.put(`${studyUrl}/${sdSid}/topics/${id}`, payload);
  }
  getStudyRelationship(id) {
    return this.http.get(`${studyUrl}/${id}/relationships`);
  }
  addStudyRelationship(id, payload) {
    return this.http.post(`${studyUrl}/${id}/relationships`, payload);
  }
  editStudyRelationship(id, sdSid, payload) {
    return this.http.put(`${studyUrl}/${sdSid}/relationships/${id}`, payload);
  }
  getStudyContributor(id) {
    return this.http.get(`${studyUrl}/${id}/contributors`);
  }
  addStudyContributor(id, payload) {
    return this.http.post(`${studyUrl}/${id}/contributors`, payload);
  }
  editStudyContributor(id, sdSid, payload) {
    return this.http.put(`${studyUrl}/${sdSid}/contributors/${id}`, payload);
  }

  filterByTitle(payload) {
    return this.http.post(`${filterUrl}/filter/studies/by-title`, payload);
  }
}
