import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-object-instance',
  templateUrl: './object-instance.component.html',
  styleUrls: ['./object-instance.component.scss']
})
export class ObjectInstanceComponent implements OnInit {
  form: FormGroup;;

  constructor( private fb: FormBuilder) { 
    this.form = this.fb.group({
      objectInstances: this.fb.array([])
    });
  }

  ngOnInit(): void {
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

}
