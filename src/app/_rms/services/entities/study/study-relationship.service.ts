import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';


@Injectable({providedIn: 'root'})
export class StudyRelationshipService {

    constructor(
        private http: HttpClient
    ) {
    }

}
