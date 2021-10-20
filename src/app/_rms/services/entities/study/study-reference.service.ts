import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';


@Injectable({providedIn: 'root'})
export class StudyReferenceService {

    constructor(
        private http: HttpClient
    ) {
    }

}
