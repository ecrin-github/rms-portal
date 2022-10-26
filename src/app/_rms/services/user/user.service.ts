import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const url = 'https://proxy.aai.lifescience-ri.eu/OIDC/userinfo';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor( private http: HttpClient) { }

  getUser() {
    return this.http.get(`${url}`);
  }
}
