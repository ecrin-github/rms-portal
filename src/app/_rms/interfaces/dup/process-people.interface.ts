export interface ProcessPeopleDto {
    id: number;
    processType: number;
    processId: number;
    personId: number;
    isAUser: boolean;
    notes: string;
    createdOn: string;
}
