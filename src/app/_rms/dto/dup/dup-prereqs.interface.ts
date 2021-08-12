import {DupDtoInterface} from './dup.interface';
import {DataObjectDto} from '../data-entities/object.interface';


interface PreRequisiteType {
    id: number;
    name: string;
    description: string;
}

export interface DupPrereqsDtoInterface {
    id: number;
    dup: DupDtoInterface;
    object: DataObjectDto;
    preRequisiteId: PreRequisiteType;
    preRequisiteNotes: string;
    prerequisiteMet: boolean;
    metNotes: string;
    createdOn: Date | string;
    lastEditedOn: Date | string;
}
