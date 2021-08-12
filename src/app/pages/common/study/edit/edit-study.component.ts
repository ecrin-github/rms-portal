import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';


@Component({
    selector: 'app-edit-study',
    templateUrl: './edit-study.component.html'
})
export class EditStudyComponent implements OnInit {

    public isCollapsed = false;

    studyForm: FormGroup;

    constructor(
        private fb: FormBuilder
    ) {
        this.studyForm = this.fb.group({
            displayTitle: '',
            briefDescription: '',
            dataSharingStatement: '',
            studyType: '',
            studyStatus: '',
            studyGenderElig: '',
            studyEnrolment: 0,
            minAge: this.fb.group({
                value: 0,
                unitName: ''
            }),
            maxAge: this.fb.group({
                value: 0,
                unitName: ''
            }),
            studyIdentifiers: this.fb.array([]),
            studyTitles: this.fb.array([]),
            studyFeatures: this.fb.array([]),
            studyTopics: this.fb.array([]),
            studyRelationships: this.fb.array([]),
            provenanceString: ''
        });

    }

    studyIdentifiers(): FormArray {
        return this.studyForm.get('studyIdentifiers') as FormArray;
    }

    newStudyIdentifier(): FormGroup {
        return this.fb.group({
            identifierValue: '',
            identifierType: '',
            identifierDate: '',
            identifierLink: '',
            identifierOrg: ''
        });
    }

    addStudyIdentifier() {
        this.studyIdentifiers().push(this.newStudyIdentifier());
    }

    removeStudyIdentifier(i: number) {
        this.studyIdentifiers().removeAt(i);
    }


    studyTitles(): FormArray {
        return this.studyForm.get('studyTitles') as FormArray;
    }

    newStudyTitle(): FormGroup {
        return this.fb.group({
            titleType: '',
            titleText: '',
            langCode: '',
            comment: '',
        });
    }

    addStudyTitle() {
        this.studyTitles().push(this.newStudyTitle());
    }

    removeStudyTitle(i: number) {
        this.studyTitles().removeAt(i);
    }


    studyFeatures(): FormArray {
        return this.studyForm.get('studyFeatures') as FormArray;
    }

    newStudyFeature(): FormGroup {
        return this.fb.group({
            featureType: '',
            featureValue: ''
        });
    }

    addStudyFeature() {
        this.studyFeatures().push(this.newStudyFeature());
    }

    removeStudyFeature(i: number) {
        this.studyFeatures().removeAt(i);
    }


    studyTopics(): FormArray {
        return this.studyForm.get('studyTopics') as FormArray;
    }

    newStudyTopic(): FormGroup {
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

    addStudyTopic() {
        this.studyTopics().push(this.newStudyTopic());
    }

    removeStudyTopic(i: number) {
        this.studyTopics().removeAt(i);
    }


    studyRelationships(): FormArray {
        return this.studyForm.get('studyRelationships') as FormArray;
    }

    newStudyRelation(): FormGroup {
        return this.fb.group({
            relationshipType: '',
            targetStudyId: ''
        });
    }

    addStudyRelation() {
        this.studyRelationships().push(this.newStudyRelation());
    }

    removeStudyRelation(i: number) {
        this.studyRelationships().removeAt(i);
    }


    onSave() {
        console.log(this.studyForm.value);
    }

    ngOnInit() {
    }

}
