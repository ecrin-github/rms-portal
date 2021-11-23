import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { StudyService } from 'src/app/_rms/services/entities/study/study.service';

@Component({
  selector: 'app-object-topic',
  templateUrl: './object-topic.component.html',
  styleUrls: ['./object-topic.component.scss']
})
export class ObjectTopicComponent implements OnInit {
  form: FormGroup;
  topicType: [] = [];
  subscription: Subscription = new Subscription();


  constructor( private fb: FormBuilder, private studyService: StudyService) {
    this.form = this.fb.group({
      objectTopics: this.fb.array([])
    });
   }

  ngOnInit(): void {
    this.getTopicType();
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
  getTopicType() {
    const getTopicType$ = this.studyService.getTopicType().subscribe((res: any) => {
      if(res.data) {
        this.topicType = res.data;
      }
    }, error => {
      console.log('error', error);
    });
    this.subscription.add(getTopicType$);
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
