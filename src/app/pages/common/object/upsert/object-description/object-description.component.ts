import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-object-description',
  templateUrl: './object-description.component.html',
  styleUrls: ['./object-description.component.scss']
})
export class ObjectDescriptionComponent implements OnInit {
  form: FormGroup;

  constructor( private fb: FormBuilder) {
    this.form = this.fb.group({
      objectDescriptions: this.fb.array([])
    })
   }

  ngOnInit(): void {
  }
  objectDescriptions(): FormArray {
    return this.form.get('objectDescriptions') as FormArray;
  }

  newObjectDescription(): FormGroup {
    return this.fb.group({
      descriptionType: '',
      descriptionLabel: '',
      descriptionText: '',
      langCode: '',
    });
  }

  addObjectDescription() {
    this.objectDescriptions().push(this.newObjectDescription());
  }

  removeObjectDescription(i: number) {
    this.objectDescriptions().removeAt(i);
  }

}
