import {DtpDtoInterface} from '../dtp/dtp.interface';

export interface DtaDtoInterface {
    id: number;
    dtp: DtpDtoInterface;
    conformsToDefault: number;
    variations: string;
    repoSignatory1: number;
    repoSignatory2: number;
    providerSignatory1: number;
    providerSignatory2: number;
    notes: string;
    createdOn: Date | string;
    lastEditedOn: Date | string;
}
