import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-object-date',
  templateUrl: './object-date.component.html',
  styleUrls: ['./object-date.component.scss']
})
export class ObjectDateComponent implements OnInit {
  form: FormGroup;

  constructor( private fb: FormBuilder) {
    this.form = this.fb.group({
      objectDates: this.fb.array([])
    })
   }

  ngOnInit(): void {
  }
  objectDates(): FormArray {
    return this.form.get('objectDates') as FormArray;
  }

  newObjectDate(): FormGroup {
    return this.fb.group({
      dateType: '',
      isDateRange: false,
      dateAsString: '',
      startDate: '',
      endDate: '',
      comments: ''
    });
  }

  addObjectDate() {
    this.objectDates().push(this.newObjectDate());
  }

  removeObjectDate(i: number) {
    this.objectDates().removeAt(i);
  }

}
