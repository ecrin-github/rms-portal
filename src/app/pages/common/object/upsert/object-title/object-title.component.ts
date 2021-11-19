import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-object-title',
  templateUrl: './object-title.component.html',
  styleUrls: ['./object-title.component.scss']
})
export class ObjectTitleComponent implements OnInit {
  form: FormGroup;

  constructor( private fb: FormBuilder) {
    this.form = this.fb.group({
      objectTitles: this.fb.array([])
    });
   }

  ngOnInit(): void {
  }
  objectTitles(): FormArray {
    return this.form.get('objectTitles') as FormArray;
  }

  newObjectTitle(): FormGroup {
    return this.fb.group({
      titleType: '',
      titleText: '',
      langCode: '',
      comments: ''
    });
  }

  addObjectTitle() {
    this.objectTitles().push(this.newObjectTitle());
  }

  removeObjectTitle(i: number) {
    this.objectTitles().removeAt(i);
  }

}
