export interface DupInterface {
    id: number;
    orgId: number;
    statusId: number;
    initialContactDate: Date | string;
    setUpCompleted: Date | string;
    prereqsMet: Date | string;
    duaAgreedDate: Date | string;
    availabilityRequested: Date | string;
    availabilityConfirmed: Date | string;
    accessConfirmed: Date | string;
    createdOn: Date | string;
    lastEditedOn: Date | string;
}
