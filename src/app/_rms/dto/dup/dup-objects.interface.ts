import {DupDtoInterface} from './dup.interface';
import {DataObjectDto} from '../data-entities/object.interface';


interface AccessType {
    id: number;
    name: string;
    description: string;
}

export interface DupObjectsDtoInterface {
    id: number;
    dupId: DupDtoInterface;
    object: DataObjectDto;
    accessType: AccessType;
    accessDetails: string;
    notes: string;
    createdOn: Date | string;
    lastEditedOn: Date | string;
}
