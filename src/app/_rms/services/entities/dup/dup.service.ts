import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
const url = environment.baseUrl + '/rms/data-uses';
const contetUrl = environment.baseUrl + '/context'

@Injectable({
  providedIn: 'root'
})
export class DupService {

  constructor( private http: HttpClient) { }
  getStatusList() {
    return this.http.get(`${contetUrl}/rms/dup-status-types`);
  }
  getDupList() {
    return this.http.get(`${url}/processes`);
  }
  addDup(payload) {
    return this.http.post(`${url}/processes`, payload);
  }
  getDupById(id) {
    return this.http.get(`${url}/processes/${id}`);
  }
  editDup(id, payload) {
    return this.http.put(`${url}/processes/${id}`, payload);
  }
  deleteDupById(id) {
    return this.http.delete(`${url}/processes/${id}`);
  }
}
