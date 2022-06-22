import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
// const url = environment.baseUrl + '/identity/elixir'; //Elixir AAI
const url = 'https://identity.ecrin-rms.org/connect/userinfo';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor( private http: HttpClient) { }

  getUser() {
    // return this.http.get(`${url}/user-info`); //Elixir AAi
    return this.http.get(`${url}`);
  }
}
