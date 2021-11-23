import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { StudyService } from 'src/app/_rms/services/entities/study/study.service';

@Component({
  selector: 'app-study-relationship',
  templateUrl: './study-relationship.component.html',
  styleUrls: ['./study-relationship.component.scss']
})
export class StudyRelationshipComponent implements OnInit {
  form: FormGroup;
  relationshipType: [] = [];
  subscription: Subscription = new Subscription();


  constructor( private fb: FormBuilder, private studyService: StudyService) {
    this.form = this.fb.group({
      studyRelationships: this.fb.array([])
    });
   }

  ngOnInit(): void {
    this.getRelationshipType();
  }
  studyRelationships(): FormArray {
    return this.form.get('studyRelationships') as FormArray;
  }

  newStudyRelation(): FormGroup {
    return this.fb.group({
      relationshipType: '',
      targetStudyId: ''
    });
  }

  addStudyRelation() {
    this.studyRelationships().push(this.newStudyRelation());
  }

  removeStudyRelation(i: number) {
    this.studyRelationships().removeAt(i);
  }
  getRelationshipType() {
    const getRelationshipType$ = this.studyService.getReleationshiType().subscribe((res: any) => {
      if(res.data) {
        this.relationshipType = res.data;
      }
    }, error => {
      console.log('error', error);
    });
    this.subscription.add(getRelationshipType$);
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
