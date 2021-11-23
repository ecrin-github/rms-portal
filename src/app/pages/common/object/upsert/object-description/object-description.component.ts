import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DataObjectService } from 'src/app/_rms/services/entities/data-object/data-object.service';

@Component({
  selector: 'app-object-description',
  templateUrl: './object-description.component.html',
  styleUrls: ['./object-description.component.scss']
})
export class ObjectDescriptionComponent implements OnInit {
  form: FormGroup;
  descriptionType: [] = [];
  languageCode: [] = [];
  subscription: Subscription = new Subscription();

  constructor( private fb: FormBuilder, private objectService: DataObjectService) {
    this.form = this.fb.group({
      objectDescriptions: this.fb.array([])
    })
   }

  ngOnInit(): void {
    this.getDescriptionType();
    this.getLanguageCode();
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
  getDescriptionType() {
    const getDescriptionType$ = this.objectService.getDescriptionType().subscribe((res: any) => {
      if(res.data) {
        this.descriptionType = res.data;
      }
    }, error => {
      console.log('error', error);
    });
    this.subscription.add(getDescriptionType$);
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
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
