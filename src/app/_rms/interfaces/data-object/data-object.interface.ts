import { ObjectContributorDto } from './object-contributor.interface';
import {ObjectDatasetDto} from './object-dataset.interface';
import {ObjectDateDto} from './object-date.interface';
import {ObjectDescriptionDto} from './object-description.interface';
import {ObjectIdentifierDto} from './object-identifier.interface';
import {ObjectInstanceDto} from './object-instance.interface';
import {ObjectRelationshipDto} from './object-relationship.interface';
import {ObjectRightDto} from './object-right.interface';
import {ObjectTitleDto} from './object-title.interface';
import {ObjectTopicDto} from './object-topic.interface';

export interface DataObjectDto {
    id: number;
    sdOid: string | null;
    sdSid: string | null;
    displayTitle: string | null;
    version: string | null;
    doi: string | null;
    doiStatusId: number;
    publicationYear: number;
    objectClassId: number;
    objectTypeId: number;
    managingOrgId: number;
    managingOrg: string | null;
    managingOrgRorId: string | null;
    langCode: string | null;
    accessTypeId: number;
    accessDetails: string | null;
    accessDetailsUrl: string | null;
    urlLastChecked: string | null;
    eoscCategory: number;
    addStudyContribs: boolean;
    addStudyTopics: boolean;
    createdOn: string;
    objectContributors: ObjectContributorDto[] | null;
    objectDatasets: ObjectDatasetDto[] | null;
    objectDates: ObjectDateDto[] | null;
    objectDescriptions: ObjectDescriptionDto[] | null;
    objectIdentifiers: ObjectIdentifierDto[] | null;
    objectInstances: ObjectInstanceDto[] | null;
    objectRelationships: ObjectRelationshipDto[] | null;
    objectRights: ObjectRightDto[] | null;
    objectTitles: ObjectTitleDto[] | null;
    objectTopics: ObjectTopicDto[] | null;
}


export interface DataObjectDataDto {
    id: number;
    sdOid: string | null;
    sdSid: string | null;
    displayTitle: string | null;
    version: string | null;
    doi: string | null;
    doiStatusId: number;
    publicationYear: number;
    objectClassId: number;
    objectTypeId: number;
    managingOrgId: number;
    managingOrg: string | null;
    managingOrgRorId: string | null;
    langCode: string | null;
    accessTypeId: number;
    accessDetails: string | null;
    accessDetailsUrl: string | null;
    urlLastChecked: string | null;
    eoscCategory: number;
    addStudyContribs: boolean;
    addStudyTopics: boolean;
    createdOn: string;
}
