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
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatButtonModule} from '@angular/material/button';

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
                pathMatch: 'full'
            },
            {
                path: 'data-context',
                component: ContextPageComponent,
                pathMatch: 'full'
            },
            {
                path: 'data-accesses',
                component: DataAccessesPageComponent,
                pathMatch: 'full'
            },
            {
                path: 'data-transfers',
                component: DataTransfersPageComponent,
                pathMatch: 'full'
            },
            {
                path: 'object-metadata',
                component: ObjectMetadataPageComponent,
                pathMatch: 'full'
            },
            {
                path: 'reports',
                component: ReportsPageComponent,
                pathMatch: 'full'
            },
            {
                path: 'study-metadata',
                component: StudyMetadataPageComponent,
                pathMatch: 'full'
            },
        ]),
        MatTableModule,
        MatPaginatorModule,
        MatButtonModule,
    ],
})
export class MainPageModule {}
