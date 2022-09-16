import { Component, HostListener, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { ObjectListEntryInterface } from 'src/app/_rms/interfaces/data-object/data-object-listentry.interface';
import { DashboardService } from 'src/app/_rms/services/entities/dashboard/dashboard.service';

@Component({
  selector: 'app-recent-objects',
  templateUrl: './recent-objects.component.html',
})

export class RecentObjectsComponent {
  @Input() cssClass;
  @Input() objectTotal: number = 0;
  displayedColumns = ['id', 'title', 'type', 'linkedStudy', 'actions'];
  dataSource: MatTableDataSource<ObjectListEntryInterface>;

  constructor(private toastr: ToastrService, 
              private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.getObjectList();
  }
  
  getObjectList() {
    this.dashboardService.getMostRecent10Objects().subscribe((res: any) => {
      if (res && res.data) {
        this.dataSource = new MatTableDataSource(res.data);
      } else {
        this.dataSource = new MatTableDataSource();
      }
    }, error => {
      this.toastr.error(error.error.title);
    })
  }
  
  @HostListener('window:storage', ['$event'])
  refreshList(event) {
    console.log('event triggered', event)
    this.getObjectList();
  }
}
