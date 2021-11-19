import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-object-relationship',
  templateUrl: './object-relationship.component.html',
  styleUrls: ['./object-relationship.component.scss']
})
export class ObjectRelationshipComponent implements OnInit {
  form: FormGroup;

  constructor( private fb: FormBuilder) {
    this.form = this.fb.group({
      objectRelationships: this.fb.array([])
    });
   }

  ngOnInit(): void {
  }
  objectRelationships(): FormArray {
    return this.form.get('objectRelationships') as FormArray;
  }

  newObjectRelation(): FormGroup {
    return this.fb.group({
      relationshipType: '',
      targetObjectId: '',
    });
  }

  addObjectRelation() {
    this.objectRelationships().push(this.newObjectRelation());
  }

  removeObjectRelation(i: number) {
    this.objectRelationships().removeAt(i);
  }

}
