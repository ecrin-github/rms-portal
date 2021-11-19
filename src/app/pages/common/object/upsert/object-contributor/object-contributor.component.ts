import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-object-contributor',
  templateUrl: './object-contributor.component.html',
  styleUrls: ['./object-contributor.component.scss']
})
export class ObjectContributorComponent implements OnInit {
  form: FormGroup;

  constructor( private fb: FormBuilder) { 
    this.form = this.fb.group({
      objectContributors: this.fb.array([])
    });
  }

  ngOnInit(): void {
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

}
