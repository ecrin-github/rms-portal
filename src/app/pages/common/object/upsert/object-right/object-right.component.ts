import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ObjectRightInterface } from 'src/app/_rms/interfaces/data-object/object-right.interface';
import { DataObjectService } from 'src/app/_rms/services/entities/data-object/data-object.service';
import { ConfirmationWindowComponent } from '../../../confirmation-window/confirmation-window.component';

@Component({
  selector: 'app-object-right',
  templateUrl: './object-right.component.html',
  styleUrls: ['./object-right.component.scss']
})
export class ObjectRightComponent implements OnInit {
  form: FormGroup;
  @Input() sdOid: string;
  @Input() isView: boolean;
  @Input() isEdit: boolean;
  objectRight: ObjectRightInterface;
  @Input() set initiateEmit(initiateEmit: any) {
    if (initiateEmit) {
      this.emitData();
    }
  }
  @Output() emitRight: EventEmitter<any> = new EventEmitter();

  constructor( private fb: FormBuilder, private objectService: DataObjectService, private spinner: NgxSpinnerService, private toastr: ToastrService, private modalService: NgbModal) {
    this.form = this.fb.group({
      objectRights: this.fb.array([])
    });
   }

  ngOnInit(): void {
    if (this.isEdit || this.isView) {
      this.getObjectRight();
    }
  }
  objectRights(): FormArray {
    return this.form.get('objectRights') as FormArray;
  }

  newObjectRight(): FormGroup {
    return this.fb.group({
      id: '',
      sdOid: '',
      rightsName: '',
      rightsUri: '',
      comments: '',
      alreadyExist: false
    });
  }

  addObjectRight() {
    const len = this.objectRights().value.length;
    if (len) {
      if (this.objectRights().value[len-1].rightsName && this.objectRights().value[len-1].rightsUri) {
        this.objectRights().push(this.newObjectRight());
      } else {
        this.toastr.info('Please provide the Rights Name and Rights URL in the previously added Object Right');
      }
    } else {
      this.objectRights().push(this.newObjectRight());
    }
  }

  removeObjectRight(i: number) {
    if (!this.objectRights().value[i].alreadyExist) {
      this.objectRights().removeAt(i);
    } else {
      const deleteModal = this.modalService.open(ConfirmationWindowComponent, {size: 'lg', backdrop: 'static'});
      deleteModal.componentInstance.type = 'objectRight';
      deleteModal.componentInstance.id = this.objectRights().value[i].id;
      deleteModal.componentInstance.sdOid = this.objectRights().value[i].sdOid;
      deleteModal.result.then((data) => {
        if (data) {
          this.objectRights().removeAt(i);
        }
      }, error => {})
    }
  }
  getObjectRight() {
    this.spinner.show();
    this.objectService.getObjectRight(this.sdOid).subscribe((res: any) => {
      this.spinner.hide();
      if(res && res.data) {
        this.objectRight = res.data.length ? res.data : [];
        this.patchForm(this.objectRight);
      }
    }, error => {
      this.spinner.hide();
      this.toastr.error(error.error.title);
    })
  }
  patchForm(rights) {
    this.form.setControl('objectRights', this.patchArray(rights));
  }
  patchArray(rights): FormArray {
    const formArray = new FormArray([]);
    rights.forEach(right => {
      formArray.push(this.fb.group({
        id: right.id,
        sdOid: right.sdOid,
        rightsName: right.rightsName,
        rightsUri: right.rightsUri,
        comments: right.comments,
        alreadyExist: true
      }))
    });
    return formArray;
  }
  addRight(index) {
    this.spinner.show();
    const payload = this.form.value.objectRights[index];
    payload.sdOid = this.sdOid;
    delete payload.id;

    this.objectService.addObjectRight(this.sdOid, payload).subscribe((res: any) => {
      this.spinner.hide();
      if (res.statusCode === 200) {
        this.toastr.success('Object Right added successfully');
      } else {
        this.toastr.error(res.messages[0]);
      }
    }, error => {
      this.spinner.hide();
      this.toastr.error(error.error.title);
    })
  }
  editRight(rightObject) {
    const payload = rightObject.value;
    this.spinner.show();
    this.objectService.editObjectRight(payload.id, payload.sdOid, payload).subscribe((res: any) => {
      this.spinner.hide();
      if( res.statusCode === 200) {
        this.toastr.success('Object Right updated successfully');
      } else {
        this.toastr.error(res.messages[0]);
      }
    }, error => {
      this.spinner.hide();
      this.toastr.error(error.error.title);
    })
  }
  emitData() {
    const payload = this.form.value.objectRights.map(item => {
      if (!item.id) {
        delete item.id;
      }
      if(this.sdOid) {
        item.sdOid = this.sdOid;
      }
      return item;
    })
    this.emitRight.emit({data: payload, isEmit: false});
  }

}
