import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ObjectInstanceInterface } from 'src/app/_rms/interfaces/data-object/object-instance.interface';
import { DataObjectService } from 'src/app/_rms/services/entities/data-object/data-object.service';

@Component({
  selector: 'app-object-instance',
  templateUrl: './object-instance.component.html',
  styleUrls: ['./object-instance.component.scss']
})
export class ObjectInstanceComponent implements OnInit {
  form: FormGroup;
  sizeUnit: [] = [];
  resourceType: [] = [];
  subscription: Subscription = new Subscription();
  @Input() sdOid: string;
  @Input() isView: boolean;
  @Input() isEdit: boolean;
  objectInstance: ObjectInstanceInterface;
  @Input() set initiateEmit(initiateEmit: any) {
    if (initiateEmit) {
      this.emitData();
    }
  }
  @Output() emitInstance: EventEmitter<any> = new EventEmitter();

  constructor( private fb: FormBuilder, private objectService: DataObjectService, private spinner: NgxSpinnerService, private toastr: ToastrService) { 
    this.form = this.fb.group({
      objectInstances: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.getSizeUnit();
    this.getResourceType();
    if (this.isEdit || this.isView) {
      this.getObjectInstance();
    }
  }
  objectInstances(): FormArray {
    return this.form.get('objectInstances') as FormArray;
  }

  newObjectInstance(): FormGroup {
    return this.fb.group({
      id: '',
      sdOid: '',
      repositoryOrg: '',
      urlAccessible: false,
      url: '',
      resourceTypeId: '',
      resourceSize: '',
      resourceSizeUnits: '',
      resourceComments: '',
      alreadyExist: false
    });
  }

  addObjectInstance() {
    this.objectInstances().push(this.newObjectInstance());
  }

  removeObjectInstance(i: number) {
    this.objectInstances().removeAt(i);
  }
  getSizeUnit() {
    const getSizeUnit$ = this.objectService.getSizeUnit().subscribe((res: any) => {
      if(res.data) {
        this.sizeUnit = res.data;
      }
    }, error => {
      console.log('error', error);
    });
    this.subscription.add(getSizeUnit$)
  }
  getResourceType() {
    const getResourceType$ = this.objectService.getResourceType().subscribe((res: any) => {
      if (res.data) {
        this.resourceType = res.data;
      }
    }, error => {
      console.log('error',error);
    });
    this.subscription.add(getResourceType$);
  }
  getObjectInstance() {
    this.spinner.show();
    this.objectService.getObjectInstance(this.sdOid).subscribe((res: any) => {
      this.spinner.hide();
      if (res && res.data) {
        this.objectInstance = res.data.length ? res.data : [];
        this.patchForm(this.objectInstance);
      }
    }, error => {
      this.spinner.hide();
      this.toastr.error(error.error.title);
    })
  }
  patchForm(instances) {
    this.form.setControl('objectInstances', this.patchArray(instances));
  }
  patchArray(instances): FormArray {
    const formArray = new FormArray([]);
    instances.forEach(instance => {
      formArray.push(this.fb.group({
        id: instance.id,
        sdOid: instance.sdOid,
        repositoryOrg: instance.repositoryOrg,
        urlAccessible: instance.urlAccessible,
        url: instance.url,
        resourceTypeId: instance.resourceTypeId,
        resourceSize: instance.resourceSize,
        resourceSizeUnits: instance.resourceSizeUnits,
        resourceComments: instance.resourceComments,
        alreadyExist: true
      }))
    });
    return formArray;
  }
  addInstance(index) {
    this.spinner.show();
    const payload = this.form.value.objectInstances[index];
    payload.sdOid = this.sdOid;
    payload.urlAccessible = payload.urlAccessible === 'true' ? true : false;
    delete payload.id;

    this.objectService.addObjectInstance(this.sdOid, payload).subscribe((res: any) => {
      this.spinner.hide();
      if( res.statusCode === 200) {
        this.toastr.success('Object Instance added successfully');
      } else {
        this.toastr.error(res.messages[0]);
      }
    }, error => {
      this.spinner.hide();
      this.toastr.error(error.error.title);
    })
  }
  editInstance(instanceObject) {
    const payload = instanceObject.value;
    payload.urlAccessible = payload.urlAccessible === 'true' ? true : false;
    this.spinner.show();
    this.objectService.editObjectInstance(payload.id, payload.sdOid, payload).subscribe((res: any) => {
      this.spinner.hide();
      if (res.statusCode === 200) {
        this.toastr.success('Object Instance updated successfully');
      } else {
        this.toastr.error(res.messages[0]);
      }
    }, error => {
      this.spinner.hide();
      this.toastr.error(error.error.title);
    })
  }
  findResourceType(id) {
    const resourceArray: any = this.resourceType.filter((type: any) => type.id === id);
    return resourceArray && resourceArray.length ? resourceArray[0].name : '';
  }
  findSizeUnit(id) {
    const sizeArray: any = this.sizeUnit.filter((type: any) => type.id === id);
    return sizeArray && sizeArray.length ? sizeArray[0].name : '';
  }
  emitData() {
    const payload = this.form.value.objectInstances.map(item => {
      item.urlAccessible = item.urlAccessible === 'true' ? true : false;
      if (!item.id) {
        delete item.id;
      }
      if(this.sdOid) {
        item.sdOid = this.sdOid;
      }
      return item;
    })
    this.emitInstance.emit({data: payload, isEmit: false});
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
