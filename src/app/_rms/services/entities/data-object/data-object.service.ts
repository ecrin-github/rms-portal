import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
const url = environment.baseUrl + '/context';
const objectUrl = environment.baseUrl + '/metadata-management/data-objects';
const filterUrl = environment.baseUrl + '/metadata-management';

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
  getObject() {
    return this.http.get(`${objectUrl}`);
  }
  getObjectById(id) {
    return this.http.get(`${objectUrl}/${id}`);
  }
  addDataObject(payload) {
    return this.http.post(`${objectUrl}`, payload);
  }
  editDataObject(id, payload) {
    return this.http.put(`${objectUrl}/${id}`, payload);
  }
  getObjectInstance(id) {
    return this.http.get(`${objectUrl}/${id}/instances`);
  }
  addObjectInstance(id, payload) {
    return this.http.post(`${objectUrl}/${id}/instances`, payload);
  }
  editObjectInstance(id, sdSid, payload) {
    return this.http.put(`${objectUrl}/${sdSid}/instances/${id}`, payload);
  }
  getObjectTitle(id) {
    return this.http.get(`${objectUrl}/${id}/titles`);
  }
  addObjectTitle(id, payload) {
    return this.http.post(`${objectUrl}/${id}/titles`, payload);
  }
  editObjectTitle(id, sdSid, payload) {
    return this.http.put(`${objectUrl}/${sdSid}/titles/${id}`, payload);
  }
  getObjectDate(id) {
    return this.http.get(`${objectUrl}/${id}/dates`);
  }
  addObjectDate(id, payload) {
    return this.http.post(`${objectUrl}/${id}/dates`, payload);
  }
  editObjectDate(id, sdSid, payload) {
    return this.http.put(`${objectUrl}/${sdSid}/dates/${id}`, payload);
  }
  getObjectContributor(id) {
    return this.http.get(`${objectUrl}/${id}/contributors`);
  }
  addObjectContributor(id, payload) {
    return this.http.post(`${objectUrl}/${id}/contributors`, payload);
  }
  editObjectContributor(id, sdSid, payload) {
    return this.http.put(`${objectUrl}/${sdSid}/contributors/${id}`, payload);
  }
  getObjectTopic(id) {
    return this.http.get(`${objectUrl}/${id}/topics`);
  }
  addObjectTopic(id, payload) {
    return this.http.post(`${objectUrl}/${id}/topics`, payload);
  }
  editObjectTopic(id, sdSid, payload) {
    return this.http.put(`${objectUrl}/${sdSid}/topics/${id}`, payload);
  }
  getObjectIdentifier(id) {
    return this.http.get(`${objectUrl}/${id}/identifiers`);
  }
  addObjectIdentifier(id, payload) {
    return this.http.post(`${objectUrl}/${id}/identifiers`, payload);
  }
  editObjectIdentifier(id, sdSid, payload) {
    return this.http.put(`${objectUrl}/${sdSid}/identifiers/${id}`, payload);
  }
  getObjectRight(id) {
    return this.http.get(`${objectUrl}/${id}/rights`);
  }
  addObjectRight(id, payload) {
    return this.http.post(`${objectUrl}/${id}/rights`, payload);
  }
  editObjectRight(id, sdSid, payload) {
    return this.http.put(`${objectUrl}/${sdSid}/rights/${id}`, payload);
  }
  getObjectDescription(id) {
    return this.http.get(`${objectUrl}/${id}/descriptions`);
  }
  addObjectDescription(id, payload) {
    return this.http.post(`${objectUrl}/${id}/descriptions`, payload);
  }
  editObjectDescription(id, sdSid, payload) {
    return this.http.put(`${objectUrl}/${sdSid}/descriptions/${id}`, payload);
  }
  getObjectRelationship(id) {
    return this.http.get(`${objectUrl}/${id}/relationships`);
  }
  addObjectRelationship(id, payload) {
    return this.http.post(`${objectUrl}/${id}/relationships`, payload);
  }
  editObjectRelationship(id, sdSid, payload) {
    return this.http.put(`${objectUrl}/${sdSid}/relationships/${id}`, payload);
  }
  filterByTitle(payload) {
    return this.http.post(`${filterUrl}/filter/data-objects/by-title`, payload);
  }
}
