import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DataObjectService } from 'src/app/_rms/services/entities/data-object/data-object.service';

@Component({
  selector: 'app-object-relationship',
  templateUrl: './object-relationship.component.html',
  styleUrls: ['./object-relationship.component.scss']
})
export class ObjectRelationshipComponent implements OnInit {
  form: FormGroup;
  relationshipType: [] = [];
  subscription: Subscription = new Subscription();


  constructor( private fb: FormBuilder, private objectService: DataObjectService) {
    this.form = this.fb.group({
      objectRelationships: this.fb.array([])
    });
   }

  ngOnInit(): void {
    this.getRelationshipType();
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
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
