import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';
import { InlineSVGModule } from 'ng-inline-svg';
// Other
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import {StudyWidgetComponent} from './study-widget/study-widget.component';
import {ObjectWidgetComponent} from './object-widget/object-widget.component';
import {RecentStudiesComponent} from './recent-studies/recent-studies.component';
import {RecentObjectsComponent} from './recent-objects/recent-objects.component';
import {RouterModule} from '@angular/router';
import {RecentDataTransfersComponent} from './recent-data-transfers/recent-data-transfers.component';
import {RecentDataAccessesComponent} from './recent-data-accesses/recent-data-accesses.component';
import {OrganizationMembersComponent} from './organization-members/organization-members.component';

@NgModule({
  declarations: [
    // Portal widgets
    StudyWidgetComponent,
    ObjectWidgetComponent,
    RecentStudiesComponent,
    RecentObjectsComponent,
    RecentDataTransfersComponent,
    RecentDataAccessesComponent,
    OrganizationMembersComponent,
  ],
    imports: [
        CommonModule,
        InlineSVGModule,
        NgApexchartsModule,
        NgbDropdownModule,
        RouterModule,
    ],
    exports: [
        // Portal
        StudyWidgetComponent,
        ObjectWidgetComponent,
        RecentStudiesComponent,
        RecentObjectsComponent,
        RecentDataTransfersComponent,
        RecentDataAccessesComponent,
        OrganizationMembersComponent,
    ],
})
export class WidgetsModule { }
