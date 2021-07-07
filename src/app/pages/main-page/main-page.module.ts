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
import {NewContextComponent} from '../context-page/new-context/new-context.component';
import {ViewStudyComponent} from '../study-metadata-page/view-study/view-study.component';
import {EditStudyComponent} from '../study-metadata-page/edit-study/edit-study.component';
import {AddStudyComponent} from '../study-metadata-page/add-study/add-study.component';
import {AddObjectComponent} from '../object-metadata-page/add-object/add-object.component';
import {EditObjectComponent} from '../object-metadata-page/edit-object/edit-object.component';
import {ViewObjectComponent} from '../object-metadata-page/view-object/view-object.component';
import {NgbDatepickerModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {MatTabsModule} from '@angular/material/tabs';
import {StudiesContextComponent} from '../context-page/studies-context/studies-context.component';
import {ObjectsContextComponent} from '../context-page/objects-context/objects-context.component';

@NgModule({
  declarations: [
      MainPageComponent,

      ContextPageComponent,
      NewContextComponent,
      StudiesContextComponent,
      ObjectsContextComponent,

      DataAccessesPageComponent,

      DataTransfersPageComponent,

      StudyMetadataPageComponent,
      AddStudyComponent,
      EditStudyComponent,
      ViewStudyComponent,

      ObjectMetadataPageComponent,
      AddObjectComponent,
      EditObjectComponent,
      ViewObjectComponent,

      ReportsPageComponent,
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
                path: 'studies',
                component: StudyMetadataPageComponent,
                pathMatch: 'full',
            },
            {
                path: 'studies/add',
                component: AddStudyComponent,
                pathMatch: 'full'
            },
            {
                path: 'studies/edit/:id',
                component: EditStudyComponent,
                pathMatch: 'full'
            },
            {
                path: 'studies/view/:id',
                component: ViewStudyComponent,
                pathMatch: 'full'
            },
            {
                path: 'data-objects',
                component: ObjectMetadataPageComponent,
                pathMatch: 'full',
            },
            {
                path: 'data-objects/add',
                component: AddObjectComponent,
                pathMatch: 'full',
            },
            {
                path: 'data-objects/edit/:id',
                component: EditObjectComponent,
                pathMatch: 'full'
            },
            {
                path: 'data-objects/view/:id',
                component: ViewObjectComponent,
                pathMatch: 'full'
            },
            {
                path: 'reports',
                component: ReportsPageComponent,
                pathMatch: 'full'
            },
        ]),
        MatTableModule,
        MatPaginatorModule,
        MatButtonModule,
        NgbDatepickerModule,
        FormsModule,
        MatTabsModule,
    ],
})
export class MainPageModule {}
