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
}
