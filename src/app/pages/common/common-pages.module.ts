// Angular modules
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatButtonModule} from '@angular/material/button';
import {NgbDatepickerModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatTabsModule} from '@angular/material/tabs';
import {MatExpansionModule} from '@angular/material/expansion';
import {RouterModule} from '@angular/router';

// Pages
import {ContextPageComponent} from './context-page/context-page.component';
import {NewContextComponent} from './context-page/new-context/new-context.component';
import {StudiesContextComponent} from './context-page/studies-context/studies-context.component';
import {ObjectsContextComponent} from './context-page/objects-context/objects-context.component';
import {ViewDupComponent} from './dup/view/view-dup.component';
import {ViewDtpComponent} from './dtp/view/view-dtp.component';
import {EditStudyComponent} from './study/edit/edit-study.component';
import {ViewStudyComponent} from './study/view/view-study.component';
import {EditObjectComponent} from './object/edit/edit-object.component';
import {ViewObjectComponent} from './object/view/view-object.component';
import {EditDtpComponent} from './dtp/edit/edit-dtp.component';
import {EditDupComponent} from './dup/edit/edit-dup.component';


@NgModule({
    declarations: [
        ContextPageComponent,
        NewContextComponent,
        StudiesContextComponent,
        ObjectsContextComponent,

        ViewDtpComponent,
        EditDtpComponent,

        ViewDupComponent,
        EditDupComponent,

        EditStudyComponent,
        ViewStudyComponent,

        EditObjectComponent,
        ViewObjectComponent,
    ],
    imports: [
        CommonModule,
        RouterModule.forChild([
            // Data context route
            {
                path: 'data-context',
                pathMatch: 'full',
                component: ContextPageComponent
            },
            // DUP details pages
            {
                path: 'data-use/:id/view',
                pathMatch: 'full',
                component: ViewDupComponent
            },
            {
                path: 'data-use/:id/edit',
                pathMatch: 'full',
                component: EditDupComponent
            },
            // DTP details pages
            {
                path: 'data-transfers/:id/view',
                pathMatch: 'full',
                component: ViewDtpComponent
            },
            {
                path: 'data-transfers/:id/edit',
                pathMatch: 'full',
                component: EditDtpComponent
            },
            // Studies details pages
            {
                path: 'studies/:id/edit',
                pathMatch: 'full',
                component: EditStudyComponent
            },
            {
                path: 'studies/:id/view',
                pathMatch: 'full',
                component: ViewStudyComponent
            },
            // Object details pages
            {
                path: 'data-objects/:id/edit',
                pathMatch: 'full',
                component: EditObjectComponent
            },
            {
                path: 'data-objects/:id/view',
                pathMatch: 'full',
                component: ViewObjectComponent
            }
        ]),
        MatTableModule,
        MatPaginatorModule,
        MatButtonModule,
        NgbDatepickerModule,
        FormsModule,
        ReactiveFormsModule,
        MatTabsModule,
        MatExpansionModule,
    ],
    exports: []
})
export class CommonPagesModule {}
