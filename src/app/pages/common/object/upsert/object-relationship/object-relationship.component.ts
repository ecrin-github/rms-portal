import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ObjectRelationshipInterface } from 'src/app/_rms/interfaces/data-object/object-relationship.interface';
import { DataObjectService } from 'src/app/_rms/services/entities/data-object/data-object.service';
import { ConfirmationWindowComponent } from '../../../confirmation-window/confirmation-window.component';

@Component({
  selector: 'app-object-relationship',
  templateUrl: './object-relationship.component.html',
  styleUrls: ['./object-relationship.component.scss']
})
export class ObjectRelationshipComponent implements OnInit {
  form: FormGroup;
  relationshipType: [] = [];
  objectList: [] = [];
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

  constructor( private fb: FormBuilder, private objectService: DataObjectService, private spinner: NgxSpinnerService, private toastr: ToastrService, private modalService: NgbModal) {
    this.form = this.fb.group({
      objectRelationships: this.fb.array([])
    });
   }

  ngOnInit(): void {
    this.getRelationshipType();
    this.getObjectList();
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
    const len = this.objectRelationships().value.length;
    if (len) {
      if (this.objectRelationships().value[len-1].relationshipTypeId && this.objectRelationships().value[len-1].targetSdOid) {
        this.objectRelationships().push(this.newObjectRelation());
      } else {
        this.toastr.info('Please provide the Relationship Type and Target Data Object in the previously added Object Relation');
      }
    } else {
      this.objectRelationships().push(this.newObjectRelation());
    }
  }

  removeObjectRelation(i: number) {
    if (!this.objectRelationships().value[i].alreadyExist) {
      this.objectRelationships().removeAt(i);
    } else {
      const removeModal = this.modalService.open(ConfirmationWindowComponent, {size: 'lg', backdrop:'static'});
      removeModal.componentInstance.type = 'objectRelationship';
      removeModal.componentInstance.id = this.objectRelationships().value[i].id;
      removeModal.componentInstance.sdOid = this.objectRelationships().value[i].sdOid;
      removeModal.result.then((data) => {
        if (data) {
          this.objectRelationships().removeAt(i);
        }
      }, error => {})
    }
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
  getObjectList() {
    setTimeout(() => {
      this.spinner.show();
    });
    this.objectService.getObject().subscribe((res: any) => {
      this.spinner.hide();
      if (res && res.data) {
        this.objectList = res.data.length ? res.data : [];
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
  customSearchFn(term: string, item) {
    term = term.toLocaleLowerCase();
    return item.sdOid.toLocaleLowerCase().indexOf(term) > -1 || item.displayTitle.toLocaleLowerCase().indexOf(term) > -1;
  }
}
