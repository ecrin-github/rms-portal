import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DataObjectService } from 'src/app/_rms/services/entities/data-object/data-object.service';

@Component({
  selector: 'app-object-contributor',
  templateUrl: './object-contributor.component.html',
  styleUrls: ['./object-contributor.component.scss']
})
export class ObjectContributorComponent implements OnInit {
  form: FormGroup;
  contributorType: [] = [];
  subscription: Subscription = new Subscription();

  constructor( private fb: FormBuilder, private objectService: DataObjectService) { 
    this.form = this.fb.group({
      objectContributors: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.getContributorType();
  }
  objectContributors(): FormArray {
    return this.form.get('objectContributors') as FormArray;
  }

  newObjectContributor(): FormGroup {
    return this.fb.group({
      contributionType: '',
      isIndividual: false,
      organisation: '',
      person: this.fb.group({
        familyName: '',
        givenName: '',
        fullName: '',
        orcid: '',
        affiliation: '',
      })
    });
  }

  addObjectContributor() {
    this.objectContributors().push(this.newObjectContributor());
  }

  removeObjectContributor(i: number) {
    this.objectContributors().removeAt(i);
  }
  getContributorType() {
    const getContributorType$ = this.objectService.getContributorType().subscribe((res:any) => {
      if(res.data) {
        this.contributorType = res.data;
      }
    }, error => {
      console.log('error', error);
    });
    this.subscription.add(getContributorType$);
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
