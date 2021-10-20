import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';


@Injectable({providedIn: 'root'})
export class DataObjectService {

    constructor(
        private http: HttpClient
    ) {
    }

}
