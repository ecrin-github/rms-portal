import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-study-topic',
  templateUrl: './study-topic.component.html',
  styleUrls: ['./study-topic.component.scss']
})
export class StudyTopicComponent implements OnInit {
  form: FormGroup;

  constructor( private fb: FormBuilder) { 
    this.form = this.fb.group({
      studyTopics: this.fb.array([])
    })
  }

  ngOnInit(): void {
  }
  studyTopics(): FormArray {
    return this.form.get('studyTopics') as FormArray;
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

}
