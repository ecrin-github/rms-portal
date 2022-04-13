import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
const url = environment.baseUrl + '/rms/data-transfers';
const context = environment.baseUrl + '/context';
const filterUrl = environment.baseUrl + '/rms';

@Injectable({
  providedIn: 'root'
})
export class DtpService {

  constructor( private http: HttpClient) { }
  getOrganizationList() {
    return this.http.get(`${context}/organisations`);
  }
  getStatusList() {
    return this.http.get(`${context}/rms/dtp-status-types`);
  }
  getDtpList() {
    return this.http.get(`${url}/processes`);
  }
  addDtp(payload) {
    return this.http.post(`${url}/processes`, payload);
  }
  getDtpById(id) {
    return this.http.get(`${url}/processes/${id}`);
  }
  editDtp(id, payload) {
    return this.http.put(`${url}/processes/${id}`, payload);
  }
  filterByTitle(payload) {
    return this.http.post(`${filterUrl}/filter/dtp/by-title`, payload);
  }
  deleteDtpById(id) {
    return this.http.delete(`${url}/processes/${id}`);
  }
}
