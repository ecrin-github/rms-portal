import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';


@Injectable({
  providedIn: 'root'
})
export class PdfGeneratorService {

  constructor() { }

  dtpPdfGenerator(dtpData, peopleData) {
    
    const doc = new jsPDF();

    const bodyData: Array<any> = [];

    bodyData.push([{content: dtpData.coreDtp.displayName, colSpan: 4, rowSpan: 1, styles: {halign: 'left', fontStyle: 'bold', fontSize: 16}}]);
    bodyData.push([
      { content: 'Organization: ' + dtpData.coreDtp.orgId, colSpan: 2, rowSpan: 1, styles: { halign: 'left' } },
      { content: 'Status: ' + dtpData.coreDtp.statusId, colSpan: 2, rowSpan: 1, styles: { halign: 'left' } }
    ]);
    bodyData.push([
      { content: 'Initial Contact Date: ' + dtpData.coreDtp.initialContactDate, colSpan: 2, styles: { halign: 'left' } },
      { content: 'SetUp Completed: ' + dtpData.coreDtp.setUpCompleted, colSpan: 2, styles: { halign: 'left' } },
    ]);
    bodyData.push([
      { content: 'MD Access Granted: ' + dtpData.coreDtp.mdAccessGranted, colSpan: 2, styles: { halign: 'left' } },
      { content: 'MD Completed: ' + dtpData.coreDtp.mdCompleteDate, colSpan: 2, rowSpan: 1, styles: { halign: 'left' } },
    ])
    bodyData.push([
      { content: 'DTA Agreed: ' + dtpData.coreDtp.dtaAgreedDate, rowSpan: 1, colSpan: 2, styles: { halign: 'left' } },
      { content: 'Upload Access Requested: ' + dtpData.coreDtp.uploadAccessRequested, colSpan: 2, rowSpan: 1, styles: { halign: 'left' } }
    ]);
    bodyData.push([
      { content: 'Upload Access Confirmed: ' + dtpData.coreDtp.uploadAccessConfirmed, colSpan: 2, rowSpan: 1, styles: { halign: 'left' } },
      { content: 'Upload Completed: ' + dtpData.coreDtp.uploadsComplete, colSpan: 2, rowSpan: 1, styles: { halign: 'left' } },
    ]);
    bodyData.push([
      { content: 'QC Checks Completed: ' + dtpData.coreDtp.qcChecksCompleted, colSpan: 2, rowSpan: 1, styles: { halign: 'left' } },
      { content: 'MD integrated with MDR: ' + dtpData.coreDtp.mdIntegratedWithMdr, colSpan: 2, rowSpan: 1, styles: { halign: 'left' } },
    ])
    bodyData.push([
      { content: 'Availability Requested: ' + dtpData.coreDtp.availabilityRequested, colSpan: 2, rowSpan: 1, styles: { halign: 'left' } },
      { content: 'Availability Confirmed: ' + dtpData.coreDtp.availabilityConfirmed, colSpan: 2, rowSpan: 1, styles: { halign: 'left' } }
    ]);
    bodyData.push([
      { content: 'Agreement Details', colSpan: 4, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold', fontSize: 14 } },
    ]);
    bodyData.push([
      { content: 'Conforms To Default: ' + dtpData.dtas[0].conformsToDefault, colSpan: 2, rowSpan: 1, styles: { halign: 'left' } },
      { content: 'Variations: ' + dtpData.dtas[0].Variations, colSpan: 2, rowSpan: 1, styles: { halign: 'left' } },
      { content: 'DTA File Path: ' + dtpData.dtas[0].dtaFilePath, colSpan: 2, rowSpan: 1, styles: { halign: 'left' } }
    ]);
    bodyData.push([
      { content: 'Repository Signatory 1: ' + dtpData.dtas[0].repoSignatory1, colSpan: 2, rowSpan: 1, styles: { halign: 'left' } },
      { content: 'Repository Signatory 2: ' + dtpData.dtas[0].repoSignatory2, colSpan: 2, rowSpan: 1, styles: { halign: 'left' } },
    ]);
    bodyData.push([
      { content: 'Repository Signatory 3: ' + dtpData.dtas[0].repoSignatory3, colSpan: 2, rowSpan: 1, styles: { halign: 'left' } },
      { content: 'Repository Signatory 4: ' + dtpData.dtas[0].repoSignatory4, colSpan: 2, rowSpan: 1, styles: { halign: 'left' } },
    ]);
    bodyData.push([
      { content: 'Notes', colSpan: 4, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold', fontSize: 14 } },
    ]);
    for (let note of dtpData.dtpNotes) {
      bodyData.push([
        { content: note.author + ' ' + note.createdOn + ':' + note.text, colSpan: 4, rowSpan: 1, styles: { halign: 'left' } },
      ])
    }
    bodyData.push([
      { content: 'Associated Studies', colSpan: 4, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold', fontSize: 14 } },
    ]);

    for ( let study of dtpData.dtpStudies) {
      bodyData.push([
        { content: study.studyName + '(' + study.sdSid + ')', colSpan: 4, rowSpan: 1, styles: { halign: 'left' } },
      ])
    } 
    bodyData.push([
      { content: 'Associated Objects', colSpan: 4, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold', fontSize: 14 } },
    ]);
    for ( let object of dtpData.dtpObjects) {
      const content = object.sdOid + '(' + object.objectName + ') \n Access Type: ' + object.accessTypeId + '  Access Details: ' + object.accessDetails + '\nEmbargo Requested: ' + object.embargoRequested +
                        '  Access Check Status: ' + object.accessCheckStatusId + '  Access Check By: ' + object.accessCheckBy;
      bodyData.push([
        { content: content,colSpan: 4, rowSpan: 1, styles: { halign: 'left' } },
      ])
    }
    bodyData.push([
      { content: 'Associated People', colSpan: 4, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold', fontSize: 14 } },
    ]);
    for (let person of peopleData) {
      bodyData.push([
        { content: person.personName, colSpan: 4, rowSpan: 1, styles: { halign: 'left' } },
      ])
    }
    autoTable(doc, {
      startY: 20,
      theme: 'plain',
      body: bodyData,
    })
    doc.save(dtpData.coreDtp.displayName + '.pdf');
  }
  dupPdfGenerator(dupData, peopleData) {
    const doc = new jsPDF();

    const bodyData: Array<any> = [];

    bodyData.push([{content: dupData.coreDup.displayName, colSpan: 4, rowSpan: 1, styles: {halign: 'left', fontStyle: 'bold', fontSize: 16}}]);
    bodyData.push([
      { content: 'Organization: ' + dupData.coreDup.orgId, colSpan: 2, rowSpan: 1, styles: { halign: 'left' } },
      { content: 'Status: ' + dupData.coreDup.statusId, colSpan: 2, rowSpan: 1, styles: { halign: 'left' } }
    ]);
    bodyData.push([
      { content: 'Initial Contact Date: ' + dupData.coreDup.initialContactDate, colSpan: 2, styles: { halign: 'left' } },
      { content: 'SetUp Completed: ' + dupData.coreDup.setUpCompleted, colSpan: 2, styles: { halign: 'left' } },
    ]);
    bodyData.push([
      { content: 'PreRequstMet: ' + dupData.coreDup.prereqsMet, colSpan: 2, styles: { halign: 'left' } },
      { content: 'DUA Agreed Date: ' + dupData.coreDup.duaAgreedDate, colSpan: 2, rowSpan: 1, styles: { halign: 'left' } },
    ])
    bodyData.push([
      { content: 'Availability Requested: ' + dupData.coreDup.availabilityRequested, rowSpan: 1, colSpan: 2, styles: { halign: 'left' } },
      { content: 'Availability Confirmed: ' + dupData.coreDup.availabilityConfirmed, colSpan: 2, rowSpan: 1, styles: { halign: 'left' } }
    ]);
    bodyData.push([
      { content: 'Access Confirmed: ' + dupData.coreDup.accessConfirmed, colSpan: 2, rowSpan: 1, styles: { halign: 'left' } },
    ]);
    bodyData.push([
      { content: 'Agreement Details', colSpan: 4, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold', fontSize: 14 } },
    ]);
    bodyData.push([
      { content: 'Conforms To Default: ' + dupData.duas[0].conformsToDefault, colSpan: 2, rowSpan: 1, styles: { halign: 'left' } },
      { content: 'Variations: ' + dupData.duas[0].Variations, colSpan: 2, rowSpan: 1, styles: { halign: 'left' } },
    ]);
    bodyData.push([
      { content: 'Repo Is Proxy Provider: ' + dupData.duas[0].repoIsProxyProvider, colSpan: 2, rowSpan: 1, styles: { halign: 'left' } },
      { content: 'DTA File Path: ' + dupData.duas[0].duaFilePath, colSpan: 2, rowSpan: 1, styles: { halign: 'left' } }
    ])
    bodyData.push([
      { content: 'Repository Signatory 1: ' + dupData.duas[0].repoSignatory1, colSpan: 2, rowSpan: 1, styles: { halign: 'left' } },
      { content: 'Repository Signatory 2: ' + dupData.duas[0].repoSignatory2, colSpan: 2, rowSpan: 1, styles: { halign: 'left' } },
    ]);
    bodyData.push([
      { content: 'Provider Signatory 1: ' + dupData.duas[0].providerSignatory1, colSpan: 2, rowSpan: 1, styles: { halign: 'left' } },
      { content: 'Provider Signatory 2: ' + dupData.duas[0].providerSignatory2, colSpan: 2, rowSpan: 1, styles: { halign: 'left' } },
    ]);
    bodyData.push([
      { content: 'RequesterSignatory 1: ' + dupData.duas[0].requesterSignatory1, colSpan: 2, rowSpan: 1, styles: { halign: 'left' } },
      { content: 'RequesterSignatory 2: ' + dupData.duas[0].requesterSignatory2, colSpan: 2, rowSpan: 1, styles: { halign: 'left' } },
    ]);
    bodyData.push([
      { content: 'Notes', colSpan: 4, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold', fontSize: 14 } },
    ]);
    for (let note of dupData.dupNotes) {
      bodyData.push([
        { content: note.author + ' ' + note.createdOn + ':' + note.text, colSpan: 4, rowSpan: 1, styles: { halign: 'left' } },
      ])
    }
    bodyData.push([
      { content: 'Associated Studies', colSpan: 4, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold', fontSize: 14 } },
    ]);

    for ( let study of dupData.dupStudies) {
      bodyData.push([
        { content: study.studyName + '(' + study.sdSid + ')', colSpan: 4, rowSpan: 1, styles: { halign: 'left' } },
      ])
    } 
    bodyData.push([
      { content: 'Associated Objects', colSpan: 4, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold', fontSize: 14 } },
    ]);
    for ( let object of dupData.dupObjects) {
      bodyData.push([
        { content: object.sdOid + '(' + object.objectName + ')' ,colSpan: 4, rowSpan: 1, styles: { halign: 'left' } },
      ])
    }
    bodyData.push([
      { content: 'Associated People', colSpan: 4, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold', fontSize: 14 } },
    ]);
    for (let person of peopleData) {
      bodyData.push([
        { content: person.personName, colSpan: 4, rowSpan: 1, styles: { halign: 'left' } },
      ])
    }
    autoTable(doc, {
      startY: 20,
      theme: 'plain',
      body: bodyData,
    })
    doc.save(dupData.coreDup.displayName + '.pdf');
  }
  studyPdfGenerator(studyData) {
    const doc = new jsPDF();

    const bodyData: Array<any> = [];

    bodyData.push([{content: studyData.coreStudy.displayTitle, colSpan: 4, rowSpan: 1, styles: {halign: 'left', fontStyle: 'bold', fontSize: 16}}]);
    bodyData.push([
      { content: 'Study Description', colSpan: 4, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold', fontSize: 14 } },
    ]);
    bodyData.push([{content: studyData.coreStudy.briefDescription, colSpan: 4, rowSpan: 1,}]);
    bodyData.push([
      { content: 'Data Sharing Statement', colSpan: 4, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold', fontSize: 14 } },
    ]);
    bodyData.push([{content: studyData.coreStudy.dataSharingStatement, colSpan: 4, rowSpan: 1}]);
    bodyData.push([
      { content: 'Study Status: ' + studyData.coreStudy.studyStatusId, colSpan: 2, rowSpan: 1, styles: { halign: 'left' } },
      { content: 'Study Type: ' + studyData.coreStudy.studyTypeId, colSpan: 2, rowSpan: 1, styles: { halign: 'left' } }
    ]);
    bodyData.push([
      { content: 'Study Start Year: ' + studyData.coreStudy.studyStartYear, colSpan: 2, rowSpan: 1, styles: { halign: 'left' } },
      { content: 'Study Start Month: ' + studyData.coreStudy.studyStartMonth, colSpan: 2, rowSpan: 1, styles: { halign: 'left' } }
    ]);
    bodyData.push([
      { content: 'Study Gender Eligibility: ' + studyData.coreStudy.studyGenderEligId, colSpan: 2, rowSpan: 1, styles: { halign: 'left' } },
      { content: 'Study Enrollement: ' + studyData.coreStudy.studyEnrolment, colSpan: 2, rowSpan: 1, styles: { halign: 'left' } }
    ]);
    bodyData.push([
      { content: 'Min Age: ' + studyData.coreStudy.minAge + ' ' + studyData.coreStudy.minAgeUnitsId, colSpan: 2, rowSpan: 1, styles: { halign: 'left' } },
      { content: 'Max Age: ' + studyData.coreStudy.maxAge + ' ' + studyData.coreStudy.maxAgeUnitsId, colSpan: 2, rowSpan: 1, styles: { halign: 'left' } }
    ]);
    bodyData.push([
      { content: 'Study Identifiers', colSpan: 4, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold', fontSize: 14 } },
    ]);
    for (let identifier of studyData.studyIdentifiers) {
      let content = 'Identifier Type: ' + identifier.identifierTypeId + '  Identifier Value: ' + identifier.identifierValue + '  Identifier Organization:' + identifier.identifierOrg + '  Identifier Date: ' + identifier.identifierDate;
      bodyData.push([
        { content: content,colSpan: 4, rowSpan: 1, styles: { halign: 'left' } },
      ])
    }
    bodyData.push([
      { content: 'Study Titles', colSpan: 4, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold', fontSize: 14 } },
    ]);
    for (let title of studyData.studyTitles) {
      let content = 'Title Type: ' + title.titleTypeId + '  Title Text: ' + title.titleText;
      bodyData.push([
        { content: content,colSpan: 4, rowSpan: 1, styles: { halign: 'left' } },
      ])
    }
    bodyData.push([
      { content: 'Study Feature', colSpan: 4, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold', fontSize: 14 } },
    ]);
    for (let feature of studyData.studyFeatures) {
      let content = 'Feature Type: ' + feature.featureTypeId + '  Feature Value: ' + feature.featureValueId;
      bodyData.push([
        { content: content,colSpan: 4, rowSpan: 1, styles: { halign: 'left' } },
      ])
    }
    bodyData.push([
      { content: 'Study Topics', colSpan: 4, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold', fontSize: 14 } },
    ]);
    for (let topic of studyData.studyTopics) {
      let content = 'Topic Type: ' + topic.topicTypeId + '  Topic Value: ' + topic.meshValue + '  Controlled Terminology: ' + topic.originalCtId + '  CT Code: ' + topic.meshCode;
      bodyData.push([
        { content: content,colSpan: 4, rowSpan: 1, styles: { halign: 'left' } },
      ])
    }
    bodyData.push([
      { content: 'Study Relationships', colSpan: 4, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold', fontSize: 14 } },
    ]);
    for (let relationship of studyData.studyRelationships) {
      let content = 'Relationship Type: ' + relationship.relationshipTypeId + '  Target Study: ' + relationship.targetSdSid;
      bodyData.push([
        { content: content,colSpan: 4, rowSpan: 1, styles: { halign: 'left' } },
      ])
    }
    bodyData.push([
      { content: 'Study Contributors', colSpan: 4, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold', fontSize: 14 } },
    ]);
    autoTable(doc, {
      startY: 20,
      theme: 'plain',
      body: bodyData,
    })
    doc.save(studyData.coreStudy.displayTitle + '.pdf');

  }
}
