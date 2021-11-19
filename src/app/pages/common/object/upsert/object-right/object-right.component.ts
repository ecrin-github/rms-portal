import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-object-right',
  templateUrl: './object-right.component.html',
  styleUrls: ['./object-right.component.scss']
})
export class ObjectRightComponent implements OnInit {
  form: FormGroup;

  constructor( private fb: FormBuilder) {
    this.form = this.fb.group({
      objectRights: this.fb.array([])
    });
   }

  ngOnInit(): void {
  }
  objectRights(): FormArray {
    return this.form.get('objectRights') as FormArray;
  }

  newObjectRight(): FormGroup {
    return this.fb.group({
      rightsName: '',
      rightsUrl: '',
      comments: '',
    });
  }

  addObjectRight() {
    this.objectRights().push(this.newObjectRight());
  }

  removeObjectRight(i: number) {
    this.objectRights().removeAt(i);
  }

}
