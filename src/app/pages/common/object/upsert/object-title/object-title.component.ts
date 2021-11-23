import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DataObjectService } from 'src/app/_rms/services/entities/data-object/data-object.service';
import { StudyService } from 'src/app/_rms/services/entities/study/study.service';

@Component({
  selector: 'app-object-title',
  templateUrl: './object-title.component.html',
  styleUrls: ['./object-title.component.scss']
})
export class ObjectTitleComponent implements OnInit {
  form: FormGroup;
  languageCode: [] = [];
  titleType: [] = [];
  subscription: Subscription = new Subscription();


  constructor( private fb: FormBuilder, private objectService: DataObjectService, private studyService: StudyService) {
    this.form = this.fb.group({
      objectTitles: this.fb.array([])
    });
   }

  ngOnInit(): void {
    this.getLanguageCode();
    this.getTitleType();
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
  getLanguageCode() {
    const getLanguageCode$ = this.objectService.getLanguageCode().subscribe((res:any) => {
      if(res.data) {
        this.languageCode = res.data;
      }
    }, error => {
      console.log('error', error);
    });
    this.subscription.add(getLanguageCode$);
  }
  getTitleType() {
    const getTitleType$ = this.studyService.getTitleType().subscribe((res:any) => {
      if(res.data) {
        this.titleType = res.data;
      }
    }, error => {
      console.log('error', error);
    });
    this.subscription.add(getTitleType$);
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
