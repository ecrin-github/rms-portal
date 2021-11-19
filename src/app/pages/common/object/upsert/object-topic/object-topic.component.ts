import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-object-topic',
  templateUrl: './object-topic.component.html',
  styleUrls: ['./object-topic.component.scss']
})
export class ObjectTopicComponent implements OnInit {
  form: FormGroup;

  constructor( private fb: FormBuilder) {
    this.form = this.fb.group({
      objectTopics: this.fb.array([])
    });
   }

  ngOnInit(): void {
  }
  objectTopics(): FormArray {
    return this.form.get('objectTopics') as FormArray;
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

}
