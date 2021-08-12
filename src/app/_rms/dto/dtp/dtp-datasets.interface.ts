import {DataObjectDto} from '../data-entities/object.interface';

export interface DtpDatasetsDtoInterface {
    id: number;
    object: DataObjectDto;
    legalStatusId: number;
    legalStatusText: string;
    descmdCheckStatus: number;
    descmdCheckDate: Date | string;
    descmdCheckBy: number;
    deidentCheckStatus: number;
    deidentCheckDate: Date | string;
    deidentCheckBy: number;
    notes: string;
    createdOn: Date | string;
    lastEditedOn: Date | string;
}
