import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';


@Component({
    selector: 'app-edit-object',
    templateUrl: './edit-object.component.html'
})
export class EditObjectComponent implements OnInit {

    public isCollapsed = true;

    objectForm: FormGroup;

    constructor(
        private fb: FormBuilder
    ) {
        this.objectForm = this.fb.group({
            doi: '',
            displayTitle: '',
            version: '',
            objectClass: '',
            objectType: '',
            publicationYear: 0,
            langCode: '',
            managingOrganisation: '',
            accessType: '',
            accessDetails: this.fb.group({
                description: '',
                url: ''
            }),
            eoscCategory: 0,
            datasetRecordKeys: this.fb.group({
                keysTypes: '',
                keysDetails: ''
            }),
            datasetDeidentLevel: this.fb.group({
                deidentType: '',
                deidentDirect: false,
                deidentHipaa: false,
                deidentDates: false,
                deidentNonarr: false,
                deidentKanon: false,
                deidentDetails: ''
            }),
            datasetConsent: this.fb.group({
                consentType: '',
                consentNoncommercial: false,
                consentGeogRestrict: false,
                consentResearchType: false,
                consentGeneticOnly: false,
                consentNoMethods: false,
                consentsDetails: '',
            }),
            objectInstances: this.fb.array([]),
            objectTitles: this.fb.array([]),
            objectDates: this.fb.array([]),
            objectContributors: this.fb.array([]),
            objectTopics: this.fb.array([]),
            objectIdentifiers: this.fb.array([]),
            objectDescriptions: this.fb.array([]),
            objectRights: this.fb.array([]),
            objectRelationships: this.fb.array([]),
        });
    }

    objectInstances(): FormArray {
        return this.objectForm.get('objectInstances') as FormArray;
    }

    newObjectInstance(): FormGroup {
        return this.fb.group({
            repositoryOrg: '',
            accessDetails: this.fb.group({
                directAccess: false,
                url: ''
            }),
            resourceDetails: this.fb.group({
                typeName: '',
                size: 0,
                sizeUnit: '',
                comments: ''
            })
        });
    }

    addObjectInstance() {
        this.objectInstances().push(this.newObjectInstance());
    }

    removeObjectInstance(i: number) {
        this.objectInstances().removeAt(i);
    }


    objectTitles(): FormArray {
        return this.objectForm.get('objectTitles') as FormArray;
    }

    newObjectTitle(): FormGroup {
        return this.fb.group({
            titleType: '',
            titleText: '',
            langCode: '',
            comments: ''
        });
    }

    addObjectTitle() {
        this.objectTitles().push(this.newObjectTitle());
    }

    removeObjectTitle(i: number) {
        this.objectTitles().removeAt(i);
    }


    objectDates(): FormArray {
        return this.objectForm.get('objectDates') as FormArray;
    }

    newObjectDate(): FormGroup {
        return this.fb.group({
            dateType: '',
            isDateRange: false,
            dateAsString: '',
            startDate: '',
            endDate: '',
            comments: ''
        });
    }

    addObjectDate() {
        this.objectDates().push(this.newObjectDate());
    }

    removeObjectDate(i: number) {
        this.objectDates().removeAt(i);
    }


    objectContributors(): FormArray {
        return this.objectForm.get('objectContributors') as FormArray;
    }

    newObjectContributor(): FormGroup {
        return this.fb.group({
            contributionType: '',
            isIndividual: false,
            organisation: '',
            person: this.fb.group({
                familyName: '',
                givenName: '',
                fullName: '',
                orcid: '',
                affiliation: '',
            })
        });
    }

    addObjectContributor() {
        this.objectContributors().push(this.newObjectContributor());
    }

    removeObjectContributor(i: number) {
        this.objectContributors().removeAt(i);
    }


    objectTopics(): FormArray {
        return this.objectForm.get('objectTopics') as FormArray;
    }

    newObjectTopic(): FormGroup {
        return this.fb.group({
            topicType: '',
            meshCoded: false,
            topicCode: '',
            topicValue: '',
            topicQualCode: '',
            topicQualValue: '',
            originalValue: '',
        });
    }

    addObjectTopic() {
        this.objectTopics().push(this.newObjectTopic());
    }

    removeObjectTopic(i: number) {
        this.objectTopics().removeAt(i);
    }


    objectIdentifiers(): FormArray {
        return this.objectForm.get('objectIdentifiers') as FormArray;
    }

    newObjectIdentifier(): FormGroup {
        return this.fb.group({
            identifierValue: '',
            identifierType: '',
            identifierDate: '',
            identifierOrg: '',
        });
    }

    addObjectIdentifier() {
        this.objectIdentifiers().push(this.newObjectIdentifier());
    }

    removeObjectIdentifier(i: number) {
        this.objectIdentifiers().removeAt(i);
    }


    objectDescriptions(): FormArray {
        return this.objectForm.get('objectDescriptions') as FormArray;
    }

    newObjectDescription(): FormGroup {
        return this.fb.group({
            descriptionType: '',
            descriptionLabel: '',
            descriptionText: '',
            langCode: '',
        });
    }

    addObjectDescription() {
        this.objectDescriptions().push(this.newObjectDescription());
    }

    removeObjectDescription(i: number) {
        this.objectDescriptions().removeAt(i);
    }


    objectRights(): FormArray {
        return this.objectForm.get('objectRights') as FormArray;
    }

    newObjectRight(): FormGroup {
        return this.fb.group({
            rightsName: '',
            rightsUrl: '',
            comments: '',
        });
    }

    addObjectRight() {
        this.objectRights().push(this.newObjectRight());
    }

    removeObjectRight(i: number) {
        this.objectRights().removeAt(i);
    }


    objectRelationships(): FormArray {
        return this.objectForm.get('objectRelationships') as FormArray;
    }

    newObjectRelation(): FormGroup {
        return this.fb.group({
            relationshipType: '',
            targetObjectId: '',
        });
    }

    addObjectRelation() {
        this.objectRelationships().push(this.newObjectRelation());
    }

    removeObjectRelation(i: number) {
        this.objectRelationships().removeAt(i);
    }

    onSave(){
        console.log(this.objectForm.value);
    }


    ngOnInit(): void {
    }

}
