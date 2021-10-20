import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';


@Injectable({providedIn: 'root'})
export class DtpObjectService {

    constructor(
        private http: HttpClient
    ) {
    }

}
