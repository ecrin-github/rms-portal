import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ObjectRelationshipInterface } from 'src/app/_rms/interfaces/data-object/object-relationship.interface';
import { DataObjectService } from 'src/app/_rms/services/entities/data-object/data-object.service';

@Component({
  selector: 'app-object-relationship',
  templateUrl: './object-relationship.component.html',
  styleUrls: ['./object-relationship.component.scss']
})
export class ObjectRelationshipComponent implements OnInit {
  form: FormGroup;
  relationshipType: [] = [];
  subscription: Subscription = new Subscription();
  @Input() isView: boolean;
  @Input() isEdit: boolean;
  @Input() sdOid: string;
  objectRelation: ObjectRelationshipInterface;
  @Input() set initiateEmit(initiateEmit: any) {
    if (initiateEmit) {
      this.emitData();
    }
  }
  @Output() emitRelation: EventEmitter<any> = new EventEmitter();

  constructor( private fb: FormBuilder, private objectService: DataObjectService, private spinner: NgxSpinnerService, private toastr: ToastrService) {
    this.form = this.fb.group({
      objectRelationships: this.fb.array([])
    });
   }

  ngOnInit(): void {
    this.getRelationshipType();
    if (this.isView || this.isEdit) {
      this.getObjectRelation();
    }
  }
  objectRelationships(): FormArray {
    return this.form.get('objectRelationships') as FormArray;
  }

  newObjectRelation(): FormGroup {
    return this.fb.group({
      id: '',
      sdOid: '',
      relationshipTypeId: '',
      targetSdOid: '',
      alreadyExist: false
    });
  }

  addObjectRelation() {
    this.objectRelationships().push(this.newObjectRelation());
  }

  removeObjectRelation(i: number) {
    this.objectRelationships().removeAt(i);
  }
  getRelationshipType() {
    const getRelationshipType$ = this.objectService.getRelationshipType().subscribe((res:any) => {
      if(res.data) {
        this.relationshipType = res.data;
      }
    }, error => {
      console.log('error', error)
    });
    this.subscription.add(getRelationshipType$);
  }
  getObjectRelation() {
    this.spinner.show();
    this.objectService.getObjectRelationship(this.sdOid).subscribe((res: any) => {
      this.spinner.hide();
      if (res && res.data) {
        this.objectRelation = res.data.length ? res.data : [];
        this.patchForm(this.objectRelation);
      }
    }, error => {
      this.spinner.hide();
      this.toastr.error(error.error.title);
    })
  }
  patchForm(relations) {
    this.form.setControl('objectRelationships', this.patchArray(relations));
  }
  patchArray(relations): FormArray {
    const formArray = new FormArray([]);
    relations.forEach(relation => {
      formArray.push(this.fb.group({
        id: relation.id,
        sdOid: relation.sdOid,
        relationshipTypeId: relation.relationshipTypeId,
        targetSdOid: relation.targetSdOid,
        alreadyExist: true
      }))
    });
    return formArray;
  }
  addRelation(index) {
    this.spinner.show();
    const payload = this.form.value.objectRelationships[index];
    payload.sdOid = this.sdOid;
    delete payload.id;

    this.objectService.addObjectDescription(this.sdOid, payload).subscribe((res: any) => {
      this.spinner.hide();
      if (res.statusCode === 200) {
        this.toastr.success('Object Relationship is added successfully');
      } else {
        this.toastr.error(res.messages[0]);
      }
    }, error => {
      this.spinner.hide();
      this.toastr.error(error.error.title);
    })
  }
  editRelation(relationObject) {
    const payload = relationObject.value;
    this.spinner.show();
    this.objectService.editObjectRelationship(payload.id, payload.sdOid, payload).subscribe((res: any) => {
      this.spinner.hide();
      if (res.statusCode === 200) {
        this.toastr.success('Object Relationship updated successfully');
      } else {
        this.toastr.error(res.messages[0]);
      }
    }, error => {
      this.spinner.hide();
      this.toastr.error(error.error.title);
    })
  }
  findRelationType(id) {
    const relationArray: any = this.relationshipType.filter((type: any) => type.id === id);
    return relationArray && relationArray.length ? relationArray[0].name : '';
  }
  emitData() {
    const payload = this.form.value.objectRelationships.map(item => {
      if (!item.id) {
        delete item.id;
      }
      if(this.sdOid) {
        item.sdOid = this.sdOid;
      }
      return item;
    })
    this.emitRelation.emit({data: payload, isEmit: false});
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
