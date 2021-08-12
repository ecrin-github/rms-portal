import {DtpDtoInterface} from './dtp.interface';
import {DataObjectDto} from '../data-entities/object.interface';
import {StudyDto} from '../data-entities/study.interface';


interface AccessType {
    id: number;
    name: string;
}

interface MdCheckStatus {
    id: number;
    name: string;
}

export interface DtpObjectsDtoInterface {
    id: number;
    dtp: DtpDtoInterface;
    study: StudyDto;
    object: DataObjectDto;
    isDataset: boolean;
    accessType: AccessType;
    accessDetails: string;
    requiresEmbargoPeriod: boolean;
    embargoEndDate: Date | string;
    embargoStillApplies: boolean;
    mdCheckStatus: MdCheckStatus;
    mdCheckDate: Date | string;
    mdCheckBy: string;
    notes: string;
    createdOn: Date | string;
    lastEditedOn: Date | string;
}
