import {Injectable} from '@angular/core';
import {DtpInterface} from '../../../interfaces/dtp/dtp.interface';
import {DupInterface} from '../../../interfaces/dup/dup.interface';
import {DataObject} from '../../../interfaces/data-entities/object.interface';
import {Study} from '../../../interfaces/data-entities/study.interface';


@Injectable({providedIn: 'root'})
export class JsonExportService {
    constructor() {
    }

    dtpJsonBuilder(dtp: DtpInterface) {

    }

    dupJsonBuilder(dup: DupInterface) {

    }

    objectJsonBuilder(object: DataObject) {

    }

    studyJsonBuilder(study: Study) {

    }

    saveDtpAsJson(id: number) {

    }

    saveDupAsJson(id: number) {

    }

    saveObjectAsJson(id: number) {

    }

    saveStudyAsJson(id: number) {

    }

}
