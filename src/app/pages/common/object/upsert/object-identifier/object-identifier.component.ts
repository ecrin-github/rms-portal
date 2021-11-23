import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { StudyService } from 'src/app/_rms/services/entities/study/study.service';

@Component({
  selector: 'app-object-identifier',
  templateUrl: './object-identifier.component.html',
  styleUrls: ['./object-identifier.component.scss']
})
export class ObjectIdentifierComponent implements OnInit {
  form: FormGroup;
  identifierType: [] = [];
  subscription: Subscription = new Subscription();

  constructor( private fb: FormBuilder, private studyService: StudyService) {
    this.form = this.fb.group({
      objectIdentifiers: this.fb.array([])
    });
   }

  ngOnInit(): void {
    this.getIdentifierType();
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
  getIdentifierType() {
    const getIdentifierType$ = this.studyService.getIdentifierType().subscribe((res:any) => {
      if(res.data) {
        this.identifierType = res.data;
      }
    }, error => {
      console.log('error', error);
    });
    this.subscription.add(getIdentifierType$);
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
