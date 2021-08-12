export interface DtpStudiesInterface {
    id: number;
    dtpId: number;
    studyId: number;
    mdCheckStatus: number;
    mdCheckDate: Date | string;
    mdCheckBy: number;
    createdOn: Date | string;
    lastEditedOn: Date | string;
}
