import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { StudyService } from 'src/app/_rms/services/entities/study/study.service';

@Component({
  selector: 'app-study-topic',
  templateUrl: './study-topic.component.html',
  styleUrls: ['./study-topic.component.scss']
})
export class StudyTopicComponent implements OnInit {
  form: FormGroup;
  titleTypes: [] = [];
  subscription: Subscription = new Subscription();


  constructor( private fb: FormBuilder, private studyService: StudyService) { 
    this.form = this.fb.group({
      studyTopics: this.fb.array([])
    })
  }

  ngOnInit(): void {
    this.getTopicType();
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
  getTopicType() {
    const getTopicType$ = this.studyService.getTopicType().subscribe((res:any) => {
      if(res.data) {
        this.titleTypes = res.data;
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
