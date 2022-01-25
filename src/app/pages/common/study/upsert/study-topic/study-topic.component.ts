import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { StudyTopicInterface } from 'src/app/_rms/interfaces/study/study-topic.interface';
import { StudyService } from 'src/app/_rms/services/entities/study/study.service';

@Component({
  selector: 'app-study-topic',
  templateUrl: './study-topic.component.html',
  styleUrls: ['./study-topic.component.scss']
})
export class StudyTopicComponent implements OnInit {
  form: FormGroup;
  topicTypes: [] = [];
  subscription: Subscription = new Subscription();
  @Input() isView: boolean;
  @Input() isEdit: boolean;
  @Input() sdSid: string;
  @Input() set initiateEmit(initiateEmit: any) {
    if (initiateEmit) {
      this.emitData();
    }
  }
  @Output() emitTopic: EventEmitter<any> = new EventEmitter();
  studyTopic: StudyTopicInterface;

  constructor( private fb: FormBuilder, private studyService: StudyService, private spinner: NgxSpinnerService, private toastr: ToastrService) { 
    this.form = this.fb.group({
      studyTopics: this.fb.array([])
    })
  }

  ngOnInit(): void {
    this.getTopicType();
    if (this.isEdit || this.isView) {
      this.getStudyTopic();
    }
  }
  studyTopics(): FormArray {
    return this.form.get('studyTopics') as FormArray;
  }

  newStudyTopic(): FormGroup {
    return this.fb.group({
      id: '',
      sdSid: '',
      topicTypeId: '',
      meshCoded: false,
      meshCode: '',
      meshValue: '',
      meshQualcode: '',
      meshQualvalue: '',
      originalValue: '',
      alreadyExist: false
    });
  }

  addStudyTopic() {
    this.studyTopics().push(this.newStudyTopic());
  }

  removeStudyTopic(i: number) {
    this.studyTopics().removeAt(i);
  }
  getTopicType() {
    const getTopicType$ = this.studyService.getTopicType().subscribe((res: any) => {
      if (res.data) {
        this.topicTypes = res.data;
      }
    }, error => {
      this.toastr.error(error.error.title);
    });
    this.subscription.add(getTopicType$);
  }
  getStudyTopic() {
    this.spinner.show();
    this.studyService.getStudyTopic(this.sdSid).subscribe((res: any) => {
      if (res && res.data) {
        this.studyTopic = res.data.length ? res.data : [];
        this.patchForm(this.studyTopic);
      }
    }, error => {
      this.spinner.hide();
      this.toastr.error(error.error.title);
    })
  }
  patchForm(topics) {
    this.form.setControl('studyTopics', this.patchArray(topics));
  }
  patchArray(topics): FormArray {
    const formArray = new FormArray([]);
    topics.forEach(topic => {
      formArray.push(this.fb.group({
        id: topic.id,
        sdSid: topic.sdSid,
        topicTypeId: topic.topicTypeId,
        meshCoded: topic.meshCoded,
        meshCode: topic.meshCode,
        meshValue: topic.meshValue,
        meshQualcode: topic.meshQualcode,
        meshQualvalue: topic.meshQualvalue,
        originalValue: topic.originalValue,
        alreadyExist: true
      }))
    });
    return formArray;
  }
  addTopic(index) {
    this.spinner.show();
    const payload = this.form.value.studyTopics[index];
    payload.sdSid = this.sdSid;
    payload.meshCoded = payload.meshCoded === 'true' ? true : false;
    delete payload.id;

    this.studyService.addStudyTopic(this.sdSid, payload).subscribe((res: any) => {
      this.spinner.hide();
      if (res.statusCode === 200) {
        this.toastr.success('Study Topic added successfully');
      } else {
        this.toastr.error(res.messages[0]);
      }
    }, error => {
      this.spinner.hide();
      this.toastr.error(error.error.title);
    });
  }
  editTopic(topicObject) {
    const payload = topicObject.value;
    payload.meshCoded = payload.meshCoded === 'true' ? true : false;
    this.spinner.show();
    this.studyService.editStudyTopic(payload.id, payload.sdSid, payload).subscribe((res: any) => {
      this.spinner.hide();
      if (res.statusCode === 200) {
        this.toastr.success('Study Topic updated successfully');
      } else {
        this.toastr.error(res.messages[0]);
      }
    }, error => {
      this.spinner.hide();
      this.toastr.error(error.error.title);
    })
  }
  findTopicType(id) {
    const topicArray: any = this.topicTypes.filter((type: any) => type.id === id);
    return topicArray && topicArray.length ? topicArray[0].name : '';
  }
  emitData() {
    const payload = this.form.value.studyTopics.map(item => {
      if (!item.id) {
        delete item.id;
      }
      if(this.sdSid) {
        item.sdSid = this.sdSid;
      }
      item.meshCoded = item.meshCoded === 'true' ? true : false;
      return item;
    })
    this.emitTopic.emit({data: payload, isEmit: false});
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
