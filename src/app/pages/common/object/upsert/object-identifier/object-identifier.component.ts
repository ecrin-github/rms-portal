import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ObjectIdentifierInterface } from 'src/app/_rms/interfaces/data-object/object-identifier.interface';
import { DataObjectService } from 'src/app/_rms/services/entities/data-object/data-object.service';
import { StudyService } from 'src/app/_rms/services/entities/study/study.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationWindowComponent } from '../../../confirmation-window/confirmation-window.component';



@Component({
  selector: 'app-object-identifier',
  templateUrl: './object-identifier.component.html',
  styleUrls: ['./object-identifier.component.scss']
})
export class ObjectIdentifierComponent implements OnInit {
  form: FormGroup;
  identifierType: [] = [];
  subscription: Subscription = new Subscription();
  @Input() sdOid: string;
  @Input() isView: boolean;
  @Input() isEdit: boolean;
  objectIdentifier: ObjectIdentifierInterface;
  @Input() set initiateEmit(initiateEmit: any) {
    if (initiateEmit) {
      this.emitData();
    }
  }
  @Output() emitIdentifier: EventEmitter<any> = new EventEmitter();

  constructor( private fb: FormBuilder, private studyService: StudyService, private objectService: DataObjectService, private spinner: NgxSpinnerService, private toastr: ToastrService, private modalService: NgbModal) {
    this.form = this.fb.group({
      objectIdentifiers: this.fb.array([])
    });
   }

  ngOnInit(): void {
    this.getIdentifierType();
    if (this.isEdit || this.isView) {
      this.getObjectIdentifier();
    }
  }
  objectIdentifiers(): FormArray {
    return this.form.get('objectIdentifiers') as FormArray;
  }

  newObjectIdentifier(): FormGroup {
    return this.fb.group({
      id: '',
      sdOid: '',
      identifierValue: '',
      identifierTypeId: '',
      identifierDate: '',
      identifierOrg: '',
      alreadyExist: false
    });
  }

  addObjectIdentifier() {
    const len = this.objectIdentifiers().value.length;
    if (len) {
      if (this.objectIdentifiers().value[len-1].identifierTypeId && this.objectIdentifiers().value[len-1].identifierValue) {
        this.objectIdentifiers().push(this.newObjectIdentifier());
      } else {
        this.toastr.info('Please provide the Identifier Type and Identifier Value in the previously added Object Identifier');
      }
    } else {
      this.objectIdentifiers().push(this.newObjectIdentifier());
    }
  }

  removeObjectIdentifier(i: number) {
    if (!this.objectIdentifiers().value[i].alreadyExist) {
      this.objectIdentifiers().removeAt(i);
    } else {
      const removeModal = this.modalService.open(ConfirmationWindowComponent, {size: 'lg', backdrop: 'static'});
      removeModal.componentInstance.type = 'objectIdentifier';
      removeModal.componentInstance.id = this.objectIdentifiers().value[i].id;
      removeModal.componentInstance.sdOid = this.objectIdentifiers().value[i].sdOid;
      removeModal.result.then((data) => {
        if (data) {
          this.objectIdentifiers().removeAt(i);
        }
      }, error => {})
    }
  }
  getIdentifierType() {
    const getIdentifierType$ = this.studyService.getIdentifierType().subscribe((res:any) => {
      if(res.data) {
        this.identifierType = res.data.filter(item => item.appliesTo === 'Data Object' || item.appliesTo === 'All');
      }
    }, error => {
      console.log('error', error);
    });
    this.subscription.add(getIdentifierType$);
  }
  getObjectIdentifier() {
    this.spinner.show();
    this.objectService.getObjectIdentifier(this.sdOid).subscribe((res: any) => {
      this.spinner.hide();
      if (res && res.data) {
        this.objectIdentifier = res.data.length ? res.data : [];
        this.patchForm(this.objectIdentifier);
      }
    }, error => {
      this.spinner.hide();
      this.toastr.error(error.error.title);
    })
  }
  patchForm(identifiers) {
    this.form.setControl('objectIdentifiers', this.patchArray(identifiers));
  }
  patchArray(identifiers): FormArray {
    const formArray = new FormArray([]);
    identifiers.forEach(identifier => {
      formArray.push(this.fb.group({
        id: identifier.id,
        sdOid: identifier.sdOid,
        identifierValue: identifier.identifierValue,
        identifierTypeId: identifier.identifierTypeId,
        identifierDate: identifier.identifierDate ? this.stringTodate(identifier.identifierDate): '',
        identifierOrg: identifier.identifierOrg,
        alreadyExist: true
      }))
    });
    return formArray;
  }
  addIdentifier(index) {
    this.spinner.show();
    const payload = this.form.value.objectIdentifiers[index];
    payload.sdOid = this.sdOid;
    payload.identifierDate = this.dateToString(payload.identifierDate);
    delete payload.id;

    this.objectService.addObjectIdentifier(this.sdOid, payload).subscribe((res: any) => {
      this.spinner.hide();
      if (res.statusCode === 200) {
        this.toastr.success('Object Identifier added successfully');
      } else {
        this.toastr.error(res.messages[0]);
      }
    }, error => {
      this.spinner.hide();
      this.toastr.error(error.error.title);
    })
  }
  editIdentifier(identifierObject) {
    const payload = identifierObject.value;
    payload.identifierDate = this.dateToString(payload.identifierDate);
    this.spinner.show();
    this.objectService.editObjectIdentifier(payload.id, payload.sdOid, payload).subscribe((res: any) => {
      this.spinner.hide();
      if (res.statusCode === 200) {
        this.toastr.success('Object Identifier updated successfully');
      } else {
        this.toastr.error(res.messages[0]);
      }
    }, error => {
      this.spinner.hide();
      this.toastr.error(error.error.title);
    })
  }
  findIdentifierTyepe(id) {
    const identifierTypeArray: any = this.identifierType.filter((type: any) => type.id === id);
    return identifierTypeArray && identifierTypeArray.length ? identifierTypeArray[0].name : '';
  }
  dateToString(date) {
    const monthArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return date ? date.year+' '+monthArr[date.month-1]+' '+date.day : '';
  }
  stringTodate(date) {
    const dateArray = new Date(date);
    return date ? {year: dateArray.getFullYear(), month: dateArray.getMonth() + 1, day: dateArray.getDate()} : null
  }
  emitData() {
    const payload = this.form.value.objectIdentifiers.map(item => {
      item.identifierDate = this.dateToString(item.identifierDate);
      if (!item.id) {
        delete item.id;
      }
      if(this.sdOid) {
        item.sdOid = this.sdOid;
      }
      return item;
    })
    this.emitIdentifier.emit({data: payload, isEmit: false});
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
