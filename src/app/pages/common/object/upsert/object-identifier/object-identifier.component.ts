import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-object-identifier',
  templateUrl: './object-identifier.component.html',
  styleUrls: ['./object-identifier.component.scss']
})
export class ObjectIdentifierComponent implements OnInit {
  form: FormGroup;
  constructor( private fb: FormBuilder) {
    this.form = this.fb.group({
      objectIdentifiers: this.fb.array([])
    });
   }

  ngOnInit(): void {
  }
  objectIdentifiers(): FormArray {
    return this.form.get('objectIdentifiers') as FormArray;
  }

  newObjectIdentifier(): FormGroup {
    return this.fb.group({
      identifierValue: '',
      identifierType: '',
      identifierDate: '',
      identifierOrg: '',
    });
  }

  addObjectIdentifier() {
    this.objectIdentifiers().push(this.newObjectIdentifier());
  }

  removeObjectIdentifier(i: number) {
    this.objectIdentifiers().removeAt(i);
  }

}
