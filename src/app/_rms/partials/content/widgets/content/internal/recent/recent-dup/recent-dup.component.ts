import { Component, HostListener, Input, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { DashboardService } from 'src/app/_rms/services/entities/dashboard/dashboard.service';
import { DtpService } from 'src/app/_rms/services/entities/dtp/dtp.service';
import { DupService } from 'src/app/_rms/services/entities/dup/dup.service';

@Component({
  selector: 'app-recent-dup',
  templateUrl: './recent-dup.component.html',
})
export class RecentDupComponent {
  @Input() cssClass;
  displayedColumns = ['id', 'organisation', 'title', 'status', 'actions'];
  dataSource: MatTableDataSource<DataTransfer>;
  organizationList: [] = [];
  statusList: [] = [];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  
  constructor( private dashboardService: DashboardService, private toastr: ToastrService, private dupService: DupService, private dtpService: DtpService) { }

  ngOnInit(): void {
    this.getDupList();
    this.getOrganization();
    this.getStatus();  
  }

  getDupList() {
    const payload = {
      page: 1,
      size: 10
    }
    this.dashboardService.paginationDup(payload).subscribe((res: any) => {
      if (res && res.data) {
        this.dataSource = new MatTableDataSource(res.data);
      } else {
        this.dataSource = new MatTableDataSource();
      }
      this.dataSource.paginator = this.paginator;
    }, error => {
      this.toastr.error(error.error.title);
    })
  }
  getOrganization() {
    this.dtpService.getOrganizationList().subscribe((res: any) => {
      if (res && res.data) {
        this.organizationList = res.data;
      }
    }, error => {
      this.toastr.error(error.error.title);
    })
  }
  getStatus() {
    this.dupService.getStatusList().subscribe((res: any) => {
      if (res && res.data) {
        this.statusList = res.data;
      }
    }, error => {
      this.toastr.error(error.error.title);
    })
  }
  findOrganization(id) {
    const organizationArray: any = this.organizationList.filter((type: any) => type.id === id);
    return organizationArray && organizationArray.length ? organizationArray[0].defaultName : ''
  }
  findStatus(id) {
    const statusArray: any = this.statusList.filter((type: any) => type.id === id);
    return statusArray && statusArray.length ? statusArray[0].name : '';
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  @HostListener('window:storage', ['$event'])
  refreshList(event) {
    console.log('event triggered', event)
    this.getDupList();
  }
}
