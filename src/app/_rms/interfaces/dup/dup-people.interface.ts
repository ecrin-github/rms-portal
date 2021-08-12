export interface DupPeopleInterface {
    id: number;
    dupId: number;
    personId: number;
    isUser: boolean;
    notes: string;
    createdOn: Date | string;
    lastEditedOn: Date | string;
}
