import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ObjectDateInterface } from 'src/app/_rms/interfaces/data-object/object-date.interface';
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
  @Input() sdOid: string;
  @Input() isView: boolean;
  @Input() isEdit: boolean;
  objectDate: ObjectDateInterface;
  @Input() set initiateEmit(initiateEmit: any) {
    if (initiateEmit) {
      this.emitData();
    }
  }
  @Output() emitDate: EventEmitter<any> = new EventEmitter();

  constructor( private fb: FormBuilder, private objectService: DataObjectService, private spinner: NgxSpinnerService, private toastr: ToastrService) {
    this.form = this.fb.group({
      objectDates: this.fb.array([])
    })
   }

  ngOnInit(): void {
    this.getDateType();
    if(this.isEdit || this.isView) {
      this.getObjectDate();
    }
  }
  objectDates(): FormArray {
    return this.form.get('objectDates') as FormArray;
  }

  newObjectDate(): FormGroup {
    return this.fb.group({
      id: '',
      sdOid: '',
      dateTypeId: '',
      isDateRange: false,
      dateAsString: '',
      startDate: '',
      endDate: '',
      details: '',
      alreadyExist: false
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
  getObjectDate() {
    this.spinner.show();
    this.objectService.getObjectDate(this.sdOid).subscribe((res: any) => {
      this.spinner.hide();
      if (res && res.data) {
        this.objectDate = res.data.length ? res.data : [];
        this.patchForm(this.objectDate);
      }
    }, error => {
      this.spinner.hide();
      this.toastr.error(error.error.title);
    })
  }
  patchForm(dates) {
    this.form.setControl('objectDates',this.patchArray(dates));
  }
  patchArray(dates): FormArray {
    const formArray = new FormArray([]);
    dates.forEach(date => {
      formArray.push(this.fb.group({
        id: date.id,
        sdOid: date.sdOid,
        dateTypeId: date.dateTypeId,
        isDateRange: false,
        dateAsString: date.dateAsString,
        startDate: date.startDay ? this.stringTodate(date.startDay, date.startMonth, date.startYear) : '',
        endDate: date.endDay ? this.stringTodate(date.endDay, date.endMonth, date.endYear) : '',
        details: date.details,
        alreadyExist: true
      }))
    });
    return formArray;
  }
  addDate(index) {
    this.spinner.show();
    const payload = this.form.value.objectDates[index];
    payload.sdOid = this.sdOid;
    const startDate = this.dateToString(payload.startDate);
    const endDate = this.dateToString(payload.endDate);
    payload.startDay = startDate.day;
    payload.startMonth = startDate.month;
    payload.startYear = startDate.year;
    payload.endDay = endDate.day;
    payload.endMonth = endDate.month;
    payload.endYear = endDate.year;
    payload.isDateRange = payload.isDateRange === 'true' ? true : false 
    delete payload.id;

    this.objectService.addObjectDate(this.sdOid, payload).subscribe((res: any) => {
      this.spinner.hide();
      if (res.statusCode === 200) {
        this.toastr.success('Object Date added successfully');
      } else {
        this.toastr.error(res.messages[0]);
      }
    }, error => {
      this.spinner.hide();
      this.toastr.error(error.error.title);
    })
  }
  editDate(dateObject) {
    const payload = dateObject.value;
    const startDate = this.dateToString(payload.startDate);
    const endDate = this.dateToString(payload.endDate);
    payload.startDay = startDate.day;
    payload.startMonth = startDate.month;
    payload.startYear = startDate.year;
    payload.endDay = endDate.day;
    payload.endMonth = endDate.month;
    payload.endYear = endDate.year;
    payload.isDateRange = payload.isDateRange === 'true' ? true : false 
    this.spinner.show();
    this.objectService.editObjectDate(payload.id, payload.sdOid, payload).subscribe((res: any) => {
      this.spinner.hide();
      if (res.statusCode === 200) {
        this.toastr.success('Object Date update successfully');
      } else {
        this.toastr.error(res.messages[0]);
      }
    }, error => {
      this.spinner.hide();
      this.toastr.error(error.error.title);
    })
  }
  findDateType(id) {
    const dateTypeArray: any = this.dateType.filter((type: any) => type.id === id);
    return dateTypeArray && dateTypeArray.length ? dateTypeArray[0].name : '';
  }
  dateToString(date) {
    return {day: date.day, month: date.month, year: date.year}
  }
  stringTodate(day, month, year) {
    return { year: year, month: month, day: day};
  }
  dateToString1(date) {
    return date ? date.day + '/' + date.month + '/' + date.year : '';
  }
  emitData() {
    const payload = this.form.value.objectDates.map(item => {
      const startDate = this.dateToString(item.startDate);
      const endDate = this.dateToString(item.endDate);
      item.startDay = startDate.day;
      item.startMonth = startDate.month;
      item.startYear = startDate.year;
      item.endDay = endDate.day;
      item.endMonth = endDate.month;
      item.endYear = endDate.year;
      item.isDateRange = item.isDateRange === 'true' ? true : false 
      if (!item.id) {
        delete item.id;
      }
      if(this.sdOid) {
        item.sdOid = this.sdOid;
      }
      return item;
    })
    this.emitDate.emit({data: payload, isEmit: false});
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
