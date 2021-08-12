export interface DtpObjectsInterface {
    id: number;
    dtpId: number;
    studyId: number;
    objectId: number;
    isDataset: boolean;
    accessTypeId: number;
    accessDetails: string;
    requiresEmbargoPeriod: boolean;
    embargoEndDate: Date | string;
    embargoStillApplies: boolean;
    mdCheckStatus: number;
    mdCheckDate: Date | string;
    mdCheckBy: string;
    notes: string;
    createdOn: Date | string;
    lastEditedOn: Date | string;
}
