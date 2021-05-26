import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ErrorsComponent } from './errors.component';
import { Error1Component } from './error1/error1.component';
import { Error2Component } from './error2/error2.component';

const routes: Routes = [
  {
    path: '',
    component: ErrorsComponent,
    children: [
      {
        path: 'not-found',
        component: Error1Component,
      },
      {
        path: 'server-error',
        component: Error2Component,
      },
      { path: '', redirectTo: 'not-found', pathMatch: 'full' },
      {
        path: '**',
        component: Error1Component,
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ErrorsRoutingModule {}
