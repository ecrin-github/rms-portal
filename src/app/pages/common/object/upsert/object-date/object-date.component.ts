import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DataObjectService } from 'src/app/_rms/services/entities/data-object/data-object.service';

@Component({
  selector: 'app-object-date',
  templateUrl: './object-date.component.html',
  styleUrls: ['./object-date.component.scss']
})
export class ObjectDateComponent implements OnInit {
  form: FormGroup;
  dateType: [] = [];
  subscription: Subscription = new Subscription();

  constructor( private fb: FormBuilder, private objectService: DataObjectService) {
    this.form = this.fb.group({
      objectDates: this.fb.array([])
    })
   }

  ngOnInit(): void {
    this.getDateType();
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
  getDateType() {
    const getDateType$ = this.objectService.getDateType().subscribe((res: any) => {
      if(res.data) {
        this.dateType = res.data
      }
    }, error => {
      console.log('error', error);
    })
    this.subscription.add(getDateType$);
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
