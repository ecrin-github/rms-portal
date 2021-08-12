import {DupDtoInterface} from './dup.interface';

export interface DupNotesDtoInterface {
    id: number;
    dup: DupDtoInterface;
    text: string;
    author: string;
    createdOn: Date | string;
    lastEditedOn: Date | string;
}
