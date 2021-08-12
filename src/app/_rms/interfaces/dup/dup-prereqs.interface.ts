export interface DupPrereqsInterface {
    id: number;
    dupId: number;
    objectId: number;
    preRequisiteId: number;
    preRequisiteNotes: string;
    prerequisiteMet: boolean;
    metNotes: string;
    createdOn: Date | string;
    lastEditedOn: Date | string;
}
