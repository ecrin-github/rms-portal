interface MinAge{
   value: number;
   unitName: string;
}

interface MaxAge{
   value: number;
   unitName: string;
}

interface StudyIdentifier {
   id: number;
   identifierValue: string;
   identifierType: string;
   identifierDate: Date;
   identifierLink: string;
   identifierOrg: string;
}

interface StudyTitle {
   id: number;
   titleType: string;
   titleText: string;
   langCode: string;
   comments: string;
}

interface StudyFeature{
   id: number;
   featureType: string;
   featureValue: string;
}

interface StudyTopic{
   id: number;
   topicType: string;
   meshCoded: boolean;
   topicCode: string;
   topicValue: string;
   topicQualCode: string;
   topicQualValue: string;
   originalValue: string;
}

interface StudyRelation{
  id: number;
  relationshipType: string;
  targetStudyId: string;
}

export interface Study {
  id: number;
  displayTitle: string;
  briefDescription: string;
  dataSharingStatement: string;
  studyType: string;
  studyStatus: string;
  studyGenderElig: string;
  studyEnrolment: number;
  minAge: MinAge;
  maxAge: MaxAge;
  studyIdentifiers: Array<StudyIdentifier> | [];
  studyTitles: Array<StudyTitle> | [];
  studyFeatures: Array<StudyFeature> | [];
  studyTopics: Array<StudyTopic> | [];
  studyRelationships: Array<StudyRelation> | [];
  linkedDataObjects: Array<number> | [];
  provenanceString: string;
}


export interface StudyRecordInterface {
    id: number;
    displayTitle: string;
    studyType: string;
    studyStatus: string;
}
