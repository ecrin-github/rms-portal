import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
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


  constructor( private fb: FormBuilder, private objectService: DataObjectService) { 
    this.form = this.fb.group({
      objectInstances: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.getSizeUnit();
    this.getResourceType();
  }
  objectInstances(): FormArray {
    return this.form.get('objectInstances') as FormArray;
  }

  newObjectInstance(): FormGroup {
    return this.fb.group({
      repositoryOrg: '',
      accessDetails: this.fb.group({
        directAccess: false,
        url: ''
      }),
      resourceDetails: this.fb.group({
        typeName: '',
        size: 0,
        sizeUnit: '',
        comments: ''
      })
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
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
