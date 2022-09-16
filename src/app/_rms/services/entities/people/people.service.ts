import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
const base = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class PeopleService {

  constructor( private http: HttpClient) { }
  getPeopleList() {
    return this.http.get(`${base}/people/list`);
  }
}
