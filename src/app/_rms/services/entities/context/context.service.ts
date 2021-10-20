import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';


@Injectable({providedIn: 'root'})
export class ContextService {
    constructor(private http: HttpClient) {}

}
