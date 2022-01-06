import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
const url = environment.baseUrl + '/rms/data-transfers';
const contetUrl = environment.baseUrl + '/context';

@Injectable({
  providedIn: 'root'
})
export class DtpService {

  constructor( private http: HttpClient) { }
  getOrganizationList() {
    return this.http.get(`${contetUrl}/organisations`);
  }
  getStatusList() {
    return this.http.get(`${contetUrl}/rms/dtp-status-types`);
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
}
