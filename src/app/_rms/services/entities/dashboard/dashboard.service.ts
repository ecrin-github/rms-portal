import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
const url = environment.baseUrl + '/rms'

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
}
