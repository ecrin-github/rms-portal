import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';


@Injectable({providedIn: 'root'})
export class ObjectDescriptionService {

    constructor(
        private http: HttpClient
    ) {
    }

}
