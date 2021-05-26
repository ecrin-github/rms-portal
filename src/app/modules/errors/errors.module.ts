import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ErrorsRoutingModule} from './errors-routing.module';
import {ErrorsComponent} from './errors.component';
import {Error1Component} from './error1/error1.component';
import {Error2Component} from './error2/error2.component';


@NgModule({
  declarations: [ ErrorsComponent, Error1Component, Error2Component ],
  imports: [
    CommonModule,
    ErrorsRoutingModule
  ]
})
export class ErrorsModule {}
