import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ObjectDescriptionInterface } from 'src/app/_rms/interfaces/data-object/object-description.interface';
import { DataObjectService } from 'src/app/_rms/services/entities/data-object/data-object.service';
import { ConfirmationWindowComponent } from '../../../confirmation-window/confirmation-window.component';

@Component({
  selector: 'app-object-description',
  templateUrl: './object-description.component.html',
  styleUrls: ['./object-description.component.scss']
})
export class ObjectDescriptionComponent implements OnInit {
  form: FormGroup;
  descriptionType: [] = [];
  languageCode: [] = [];
  subscription: Subscription = new Subscription();
  @Input() isView: boolean;
  @Input() isEdit: boolean;
  @Input() sdOid: string;
  objectDescription: ObjectDescriptionInterface;
  @Input() set initiateEmit(initiateEmit: any) {
    if (initiateEmit) {
      this.emitData();
    }
  }
  @Output() emitDescription: EventEmitter<any> = new EventEmitter();
  
  constructor( private fb: FormBuilder, private objectService: DataObjectService, private spinner: NgxSpinnerService, private toastr: ToastrService, private modalService: NgbModal) {
    this.form = this.fb.group({
      objectDescriptions: this.fb.array([])
    })
   }

  ngOnInit(): void {
    this.getDescriptionType();
    this.getLanguageCode();
    if (this.isEdit || this.isView) {
      this.getObjectDescription();
    }
  }
  objectDescriptions(): FormArray {
    return this.form.get('objectDescriptions') as FormArray;
  }

  newObjectDescription(): FormGroup {
    return this.fb.group({
      id: '',
      sdOid: '',
      descriptionTypeId: '',
      label: '',
      descriptionText: '',
      langCode: '',
      alreadyExist: false
    });
  }

  addObjectDescription() {
    const len = this.objectDescriptions().value.length;
    if (len) {
      if (this.objectDescriptions().value[len-1].descriptionTypeId && this.objectDescriptions().value[len-1].label) {
        this.objectDescriptions().push(this.newObjectDescription());
      } else {
        this.toastr.info('Please provide the Description Type and Description label in the previously added Object Description');
      }
    } else {
      this.objectDescriptions().push(this.newObjectDescription());
    }
  }

  removeObjectDescription(i: number) {
    if(!this.objectDescriptions().value[i].alreadyExist) {
      this.objectDescriptions().removeAt(i);
    } else {
      const removeModal = this.modalService.open(ConfirmationWindowComponent, {size: 'lg', backdrop: 'static'});
      removeModal.componentInstance.type = 'objectDescription';
      removeModal.componentInstance.id = this.objectDescriptions().value[i].id;
      removeModal.componentInstance.sdOid = this.objectDescriptions().value[i].sdOid;
      removeModal.result.then((data) => {
        if (data) {
          this.objectDescriptions().removeAt(i);
        }
      }, error => {})
    }
  }
  getDescriptionType() {
    const getDescriptionType$ = this.objectService.getDescriptionType().subscribe((res: any) => {
      if(res.data) {
        this.descriptionType = res.data;
      }
    }, error => {
      console.log('error', error);
    });
    this.subscription.add(getDescriptionType$);
  }
  getLanguageCode() {
    const getLanguageCode$ = this.objectService.getLanguageCode().subscribe((res:any) => {
      if(res.data) {
        this.languageCode = res.data;
      }
    }, error => {
      console.log('error', error);
    });
    this.subscription.add(getLanguageCode$);
  }
  getObjectDescription() {
    this.spinner.show();
    this.objectService.getObjectDescription(this.sdOid).subscribe((res: any) => {
      this.spinner.hide();
      if (res && res.data) {
        this.objectDescription = res.data.length ? res.data : [];
        this.patchForm(this.objectDescription);
      }
    }, error => {
      this.spinner.hide();
      this.toastr.error(error.error.title);
    })
  }
  patchForm(descriptions) {
    this.form.setControl('objectDescriptions', this.patchArray(descriptions));
  }
  patchArray(descriptions): FormArray {
    const formArray = new FormArray([]);
    descriptions.forEach(description => {
      formArray.push(this.fb.group({
        id: description.id,
        sdOid: description.sdOid,
        descriptionTypeId: description.descriptionTypeId,
        label: description.label,
        descriptionText: description.descriptionText,
        langCode: description.langCode,
        alreadyExist: true
      }))
    });
    return formArray;
  }
  addDescription(index) {
    this.spinner.show();
    const payload = this.form.value.objectDescriptions[index];
    payload.sdOid = this.sdOid;
    delete payload.id;

    this.objectService.addObjectDescription(this.sdOid, payload).subscribe((res: any) => {
      this.spinner.hide();
      if (res.statusCode === 200) {
        this.toastr.success('Object Description added successfully');
      } else {
        this.toastr.error(res.messages[0]);
      }
    }, error => {
      this.spinner.hide();
      this.toastr.error(error.error.title);
    })
  }
  editDescription(descriptionObject) {
    const payload = descriptionObject.value;
    this.spinner.show();
    this.objectService.editObjectDescription(payload.id, payload.sdOid, payload).subscribe((res: any) => {
      this.spinner.hide();
      if (res.statusCode === 200) {
        this.toastr.success('Object Description updated successfully');
      } else {
        this.toastr.error(res.messages[0]);
      }
    }, error => {
      this.spinner.hide();
      this.toastr.error(error.error.title);
    })
  }
  findDescriptionType(id) {
    const descriptionArray: any = this.descriptionType.filter((type: any) => type.id === id);
    return descriptionArray && descriptionArray.length ? descriptionArray[0].name : '';
  }
  emitData() {
    const payload = this.form.value.objectDescriptions.map(item => {
      if (!item.id) {
        delete item.id;
      }
      if(this.sdOid) {
        item.sdOid = this.sdOid;
      }
      return item;
    })
    this.emitDescription.emit({data: payload, isEmit: false});
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
