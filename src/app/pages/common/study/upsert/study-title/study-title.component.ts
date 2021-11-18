import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-study-title',
  templateUrl: './study-title.component.html',
  styleUrls: ['./study-title.component.scss']
})
export class StudyTitleComponent implements OnInit {
  form: FormGroup;

  constructor( private fb: FormBuilder) {
    this.form = this.fb.group({
      studyTitles: this.fb.array([])
    });
   }

  ngOnInit(): void {
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

}
