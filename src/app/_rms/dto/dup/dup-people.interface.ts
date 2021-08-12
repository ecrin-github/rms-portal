import {DupDtoInterface} from './dup.interface';


interface Person {
    familyName: string;
    givenName: string;
    fullName: string;
    orcid: string;
    affiliation: string;
}

export interface DupPeopleDtoInterface {
    id: number;
    dup: DupDtoInterface;
    person: Person;
    isUser: boolean;
    notes: string;
    createdOn: Date | string;
    lastEditedOn: Date | string;
}
