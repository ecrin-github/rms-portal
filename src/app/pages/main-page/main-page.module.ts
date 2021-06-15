import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MainPageComponent } from './main-page.component';
import {ContextPageComponent} from '../context-page/context-page.component';
import {DataAccessesPageComponent} from '../data-accesses-page/data-accesses-page.component';
import {DataTransfersPageComponent} from '../data-transfers-page/data-transfers-page.component';
import {ObjectMetadataPageComponent} from '../object-metadata-page/object-metadata-page.component';
import {ReportsPageComponent} from '../reports-page/reports-page.component';
import {StudyMetadataPageComponent} from '../study-metadata-page/study-metadata-page.component';
import {WidgetsModule} from '../../_rms/partials/content/widgets/widgets.module';

@NgModule({
  declarations: [
      MainPageComponent,
      ContextPageComponent,
      DataAccessesPageComponent,
      DataTransfersPageComponent,
      ObjectMetadataPageComponent,
      ReportsPageComponent,
      StudyMetadataPageComponent,
  ],
  imports: [
    CommonModule,
    WidgetsModule,
    RouterModule.forChild([
      {
        path: '',
        component: MainPageComponent,
      },
      {
        path: 'data-context',
        component: ContextPageComponent,
      },
      {
        path: 'data-accesses',
        component: DataAccessesPageComponent,
      },
      {
        path: 'data-transfers',
        component: DataTransfersPageComponent,
      },
      {
        path: 'object-metadata',
        component: ObjectMetadataPageComponent,
      },
      {
        path: 'reports',
        component: ReportsPageComponent,
      },
      {
        path: 'study-metadata',
        component: StudyMetadataPageComponent,
      },
    ]),
  ],
})
export class MainPageModule {}
