import {DupDtoInterface} from './dup.interface';

export interface SecondaryUseDtoInterface {
    id: number;
    dup: DupDtoInterface;
    secondaryUseType: string;
    publication: number;
    attributionPresent: boolean;
    notes: string;
    createdOn: Date | string;
    lastEditedOn: Date | string;
}
