import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { StudyService } from 'src/app/_rms/services/entities/study/study.service';

@Component({
  selector: 'app-study-title',
  templateUrl: './study-title.component.html',
  styleUrls: ['./study-title.component.scss']
})
export class StudyTitleComponent implements OnInit {
  form: FormGroup;
  titleType: [] = [];
  subscription: Subscription = new Subscription();


  constructor( private fb: FormBuilder, private studyService: StudyService) {
    this.form = this.fb.group({
      studyTitles: this.fb.array([])
    });
   }

  ngOnInit(): void {
    this.getTitleType();
  }
  studyTitles(): FormArray {
    return this.form.get('studyTitles') as FormArray;
  }

  newStudyTitle(): FormGroup {
    return this.fb.group({
      titleType: '',
      titleText: '',
      langCode: '',
      comment: '',
    });
  }

  addStudyTitle() {
    this.studyTitles().push(this.newStudyTitle());
  }

  removeStudyTitle(i: number) {
    this.studyTitles().removeAt(i);
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
