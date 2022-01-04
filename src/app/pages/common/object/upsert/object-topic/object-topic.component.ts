import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ObjectTopicInterface } from 'src/app/_rms/interfaces/data-object/object-topic.interface';
import { DataObjectService } from 'src/app/_rms/services/entities/data-object/data-object.service';
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
  @Input() sdOid: string;
  @Input() isView: boolean;
  @Input() isEdit: boolean;
  objectTopic: ObjectTopicInterface;
  @Input() set initiateEmit(initiateEmit: any) {
    if (initiateEmit) {
      this.emitData();
    }
  }
  @Output() emitTopic: EventEmitter<any> = new EventEmitter();

  constructor( private fb: FormBuilder, private studyService: StudyService, private spinner: NgxSpinnerService, private toastr: ToastrService, private objectService: DataObjectService) {
    this.form = this.fb.group({
      objectTopics: this.fb.array([])
    });
   }

  ngOnInit(): void {
    this.getTopicType();
    if (this.isView || this.isEdit) {
      this.getObjectTopic();
    }
  }
  objectTopics(): FormArray {
    return this.form.get('objectTopics') as FormArray;
  }

  newObjectTopic(): FormGroup {
    return this.fb.group({
      id: '',
      sdOid: '',
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
  getObjectTopic() {
    this.spinner.show();
    this.objectService.getObjectTopic(this.sdOid).subscribe((res: any) => {
      this.spinner.hide();
      if (res && res.data) {
        this.objectTopic = res.data.length ? res.data : [];
        this.patchForm(this.objectTopic);
      }
    }, error => {
      this.spinner.hide();
      this.toastr.error(error.error.title);
    })
  }
  patchForm(topics) {
    this.form.setControl('objectTopics', this.patchArray(topics));
  }
  patchArray(topics): FormArray {
    const formArray = new FormArray([]);
    topics.forEach(topic => {
      formArray.push(this.fb.group({
        id: topic.id,
        sdOid: topic.sdOid,
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
    const payload = this.form.value.objectTopics[index];
    payload.sdOid = this.sdOid;
    payload.meshCoded = payload.meshCoded === 'true' ? true : false;
    delete payload.id;

    this.objectService.addObjectTopic(this.sdOid, payload).subscribe((res: any) => {
      this.spinner.hide();
      if (res.statusCode === 200) {
        this.toastr.success('Obect Topic added successfully');
      } else {
        this.toastr.error(res.messages[0]);
      }
    }, error => {
      this.spinner.hide();
      this.toastr.error(error.error.title);
    })
  }
  editTopic(topicObject) {
    const payload = topicObject.value;
    payload.meshCoded = payload.meshCoded === 'true' ? true : false;
    this.spinner.show();
    this.objectService.editObjectTopic(payload.id, payload.sdOid, payload).subscribe((res: any) => {
      this.spinner.hide();
      if (res.statusCode === 200) {
        this.toastr.success('Object Topic updated successfully');
      } else {
        this.toastr.error(res.messages[0]);
      }
    }, error => {
      this.spinner.hide();
      this.toastr.error(error.error.title);
    })
  }
  findTopicType(id) {
    const topicTypeArrray: any = this.topicType.filter((type: any) => type.id === id);
    return topicTypeArrray && topicTypeArrray.length ? topicTypeArrray[0].name : '';
  }
  emitData() {
    const payload = this.form.value.objectTopics.map(item => {
      item.meshCoded = item.meshCoded === 'true' ? true : false;
      if (!item.id) {
        delete item.id;
      }
      if(this.sdOid) {
        item.sdOid = this.sdOid;
      }
      return item;
    })
    this.emitTopic.emit({data: payload, isEmit: false});
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
