import {Injectable} from '@angular/core';
import {DtpInterface} from '../../../interfaces/dtp/dtp.interface';
import {DupInterface} from '../../../interfaces/dup/dup.interface';
import {DataObject} from '../../../interfaces/data-entities/object.interface';
import {Study} from '../../../interfaces/data-entities/study.interface';


@Injectable({providedIn: 'root'})
export class PdfExportService {
    constructor() {
    }

    dtpPdfBuilder(dtp: DtpInterface) {

    }

    dupPdfBuilder(dup: DupInterface) {

    }

    objectPdfBuilder(object: DataObject) {

    }

    studyPdfBuilder(study: Study) {

    }

    saveDtpAsPdf(id: number) {

    }

    saveDupAsPdf(id: number) {

    }

    saveObjectAsPdf(id: number) {

    }

    saveStudyAsPdf(id: number) {

    }
}
