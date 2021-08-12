export interface SecondaryUseInterface {
    id: number;
    dupId: number;
    secondaryUseType: string;
    publication: number;
    attributionPresent: boolean;
    notes: string;
    createdOn: Date | string;
    lastEditedOn: Date | string;
}
