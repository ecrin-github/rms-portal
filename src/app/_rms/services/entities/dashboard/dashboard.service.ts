import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
const url = environment.baseUrl + '/rms'
const mdmUrl = environment.baseUrl + '/metadata-management';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor( private http: HttpClient) { }
  
  getDtpStatistics() {
    return this.http.get(`${url}/statistics/dtp/statistics`);
  }
  getDupStatistics() {
    return this.http.get(`${url}/statistics/dup/statistics`);
  }
  paginationDtp(payload) {
    return this.http.post(`${url}/pagination/dtp`, payload);
  }
  paginationDup(payload) {
    return this.http.post(`${url}/pagination/dup`, payload);
  }
  getStudyStatistics() {
    return this.http.get(`${mdmUrl}/statistics/studies/statistics`);
  }
  getObjectStatistics() {
    return this.http.get(`${mdmUrl}/statistics/data-objects/statistics`);
  }
  paginationStudies(payload) {
    return this.http.post(`${mdmUrl}/pagination/studies`, payload);
  }
  paginationObject(payload) {
    return this.http.post(`${mdmUrl}/pagination/data-objects`, payload);
  }
}
