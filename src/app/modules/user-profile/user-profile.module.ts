import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {InlineSVGModule} from 'ng-inline-svg';
import {NgbDropdownModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {CRUDTableModule} from '../../_rms/shared/crud-table';
import {PersonalInformationComponent} from './personal-information/personal-information.component';
import {UserProfileRoutingModule} from './user-profile-routing.module';

@NgModule({
  declarations: [
    PersonalInformationComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    CRUDTableModule,
    FormsModule,
    ReactiveFormsModule,
    InlineSVGModule,
    UserProfileRoutingModule,
    NgbDropdownModule,
    NgbTooltipModule,
  ]
})
export class UserProfileModule {}
