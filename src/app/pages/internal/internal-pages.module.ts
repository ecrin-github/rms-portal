// Angular modules
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTabsModule} from '@angular/material/tabs';
import {NgbDatepickerModule} from '@ng-bootstrap/ng-bootstrap';


// Pages
import {InternalMainPageComponent} from './main-page/internal-main-page.component';
import {DtpSummaryInternalComponent} from './dtp/summary/dtp-summary-internal.component';
import {DupSummaryInternalComponent} from './dup/summary/dup-summary-internal.component';
import {StudiesSummaryInternalComponent} from './studies/summary/studies-summary-internal.component';
import {ObjectsSummaryInternalComponent} from './objects/summary/objects-summary-internal.component';
import {ReportsPageInternalComponent} from './reports/reports-page-internal.component';
import {AddDtpComponent} from './dtp/add/add-dtp.component';
import {AddDupComponent} from './dup/add/add-dup.component';
import {AddStudyComponent} from './studies/add/add-study.component';
import {AddObjectComponent} from './objects/add/add-object.component';

// Additional modules
import {WidgetsModule} from '../../_rms/partials/content/widgets/widgets.module';
import {ReactiveFormsModule} from '@angular/forms';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';


@NgModule({
    declarations: [
        InternalMainPageComponent,

        AddDtpComponent,
        DtpSummaryInternalComponent,

        AddDupComponent,
        DupSummaryInternalComponent,

        AddStudyComponent,
        StudiesSummaryInternalComponent,

        AddObjectComponent,
        ObjectsSummaryInternalComponent,

        ReportsPageInternalComponent
    ],
    imports: [
        CommonModule,
        WidgetsModule,
        RouterModule.forChild([
            {
                path: '',
                pathMatch: 'full',
                component: InternalMainPageComponent
            },
            // Data transfers
            {
                path: 'data-transfers',
                pathMatch: 'full',
                component: DtpSummaryInternalComponent
            },
            {
                path: 'data-transfers/add',
                pathMatch: 'full',
                component: AddDtpComponent,
            },
            // Data use
            {
                path: 'data-use',
                pathMatch: 'full',
                component: DupSummaryInternalComponent
            },
            {
                path: 'data-use/add',
                pathMatch: 'full',
                component: AddDupComponent
            },
            // Studies
            {
                path: 'studies',
                pathMatch: 'full',
                component: StudiesSummaryInternalComponent
            },
            {
                path: 'studies/add',
                pathMatch: 'full',
                component: AddStudyComponent
            },
            // Data objects
            {
                path: 'data-objects',
                pathMatch: 'full',
                component: ObjectsSummaryInternalComponent
            },
            {
                path: 'data-objects/add',
                pathMatch: 'full',
                component: AddObjectComponent
            },
            // Reports
            {
                path: 'reports',
                pathMatch: 'full',
                component: ReportsPageInternalComponent
            }
        ]),
        NgbDatepickerModule,
        MatTableModule,
        MatPaginatorModule,
        MatTabsModule,
        ReactiveFormsModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatButtonModule
    ]
})
export class InternalPagesModule {}
