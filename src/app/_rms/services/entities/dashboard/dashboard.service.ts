import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
const url = environment.baseUrl + '/rms/statistics'

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor( private http: HttpClient) { }
  
  getDtpStatistics() {
    return this.http.get(`${url}/dtp/statistics`);
  }
  getDupStatistics() {
    return this.http.get(`${url}/dup/statistics`);
  }
}
