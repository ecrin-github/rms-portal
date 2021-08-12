interface AccessDetails{
  description: string;
  url: string;
  urlLastChecked: Date;
}

interface DataSetRecordKey{
   keysType: string;
   keysDetails: string;
}

interface DataSetDeidentLevel{
   deidentType: string;
   deidentDirect: boolean;
   deidentHipaa: boolean;
   deidentDates: boolean;
   deidentNonarr: boolean;
   deidentKanon: boolean;
   deidentDetails: string;
}

interface DataSetConsent{
   consentType: string;
   consentNoncommercial: boolean;
   consentGeogRestrict: boolean;
   consentResearchType: boolean;
   consentGeneticOnly: boolean;
   consentNoMethods: boolean;
   consentsDetails: string;
}

interface InstanceAccessDetails{
   directAccess: boolean;
   url: string;
   urlLastChecked: Date;
}

interface InstanceResourceDetails{
   typeName: string;
   size: number;
   sizeUnit: string;
   comments: string;
}

interface ObjectInstance{
   id: number;
   repositoryOrg: number;
   accessDetails: InstanceAccessDetails;
   resourceDetails: InstanceResourceDetails;
}

interface ObjectTitle{
   id: number;
   titleType: string;
   titleText: string;
   langCode: string;
   comments: string;
}

interface StartDate{
   year: number;
   month: number;
   day: number;
}

interface EndDate{
   year: number;
   month: number;
   day: number;
}

interface ObjectDate{
   id: number;
   dateType: string;
   isDateRange: boolean;
   dateAsString: string;
   startDate: StartDate;
   endDate: EndDate;
   comments: string;
}

interface Person{
   familyName: string;
   givenName: string;
   fullName: string;
   orcid: string;
   affiliation: string;
}

interface ObjectContributor{
   id: number;
   contributionType: string;
   isIndividual: boolean;
   organisation: string;
   person: Person;
}

interface ObjectTopic{
   id: number;
   topicType: string;
   meshCoded: boolean;
   topicCode: string;
   topicValue: string;
   topicQualCode: string;
   topicQualValue: string;
   originalValue: string;
}

interface ObjectIdentifier{
   id: number;
   identifierValue: string;
   identifierType: string;
   identifierDate: Date;
   identifierOrg: string;
}

interface ObjectDescription{
   id: number;
   descriptionType: string;
   descriptionLabel: string;
   descriptionText: string;
   langCode: string;
}

interface ObjectRight{
   id: number;
   rightsName: string;
   rightsUrl: string;
   comments: string;
}

interface ObjectRelation{
   id: number;
   relationshipType: string;
   targetObjectId: string;
}

export interface DataObject{
   id: number;
   doi: string;
   displayTitle: string;
   version: string;
   objectClass: string;
   objectType: string;
   publicationYear: number;
   langCode: string;
   managingOrganisation: string;
   accessType: string;
   accessDetails: AccessDetails;
   eoscCategory: number;
   datasetRecordKeys: DataSetRecordKey;
   datasetDeidentLevel: DataSetDeidentLevel;
   datasetConsent: DataSetConsent;
   objectUrl: string;
   objectInstances: Array<ObjectInstance> | [];
   objectTitles: Array<ObjectTitle> | [];
   objectDates: Array<ObjectDate> | [];
   objectContributors: Array<ObjectContributor> | [];
   objectTopics: Array<ObjectTopic> | [];
   objectIdentifiers: Array<ObjectIdentifier> | [];
   objectDescriptions: Array<ObjectDescription> | [];
   objectRights: Array<ObjectRight> | [];
   objectRelationships: Array<ObjectRelation> | [];
   linkedStudies: Array<number> | [];
   provenanceString: string;
}
