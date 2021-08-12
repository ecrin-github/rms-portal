import {DtpDtoInterface} from './dtp.interface';
import {StudyDto} from '../data-entities/study.interface';

export interface DtpStudiesDtoInterface {
    id: number;
    dtp: DtpDtoInterface;
    studyId: StudyDto;
    mdCheckStatus: number;
    mdCheckDate: Date | string;
    mdCheckBy: number;
    createdOn: Date | string;
    lastEditedOn: Date | string;
}
