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
  monthValues = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  dayValues = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13','14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'];

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
      startDay: '',
      startMonth: '',
      startYear:'',
      endDay: '',
      endMonth:'',
      endYear: '',
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
        startDay: date.startDay,
        startMonth: date.startMonth,
        startYear: date.startYear ? new Date(`01/01/${date.startYear}`) : '',
        endDay: date.endDay,
        endMonth: date.endMonth,
        endYear: date.endYear ? new Date(`01/01/${date.endYear}`) : '',
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
    payload.startYear = payload.startYear ? payload.startYear.getFullYear() : null;
    payload.endYear = payload.endYear ? payload.endYear.getFullYear() : null;
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
    payload.startYear = payload.startYear ? payload.startYear.getFullYear() : null;
    payload.endYear = payload.endYear ? payload.endYear.getFullYear() : null;
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
  getYear(date) {
    return date ? date.getFullYear() : ''
  }
  findDateType(id) {
    const dateTypeArray: any = this.dateType.filter((type: any) => type.id === id);
    return dateTypeArray && dateTypeArray.length ? dateTypeArray[0].name : '';
  }
  emitData() {
    const payload = this.form.value.objectDates.map(item => {
      item.startYear = item.startYear ? item.startYear.getFullYear() : null;
      item.endYear = item.endYear ? item.endYear.getFullYear() : null;  
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
