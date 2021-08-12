import {DupDtoInterface} from '../dup/dup.interface';

export interface DuaDtoInterface {
    id: number;
    dup: DupDtoInterface;
    conformsToDefault: number;
    variations: string;
    repoAsProxy: boolean;
    repoSignatory1: number;
    repoSignatory2: number;
    providerSignatory1: number;
    providerSignatory2: number;
    requesterSignatory1: number;
    requesterSignatory2: number;
    notes: string;
    createdOn: Date | string;
    lastEditedOn: Date | string;
}
