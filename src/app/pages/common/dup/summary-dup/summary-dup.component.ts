import { Component, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { DtpService } from 'src/app/_rms/services/entities/dtp/dtp.service';
import { DupService } from 'src/app/_rms/services/entities/dup/dup.service';
export interface DataUseProcess {
  id: string;
  organisation: string;
  dataObject: string;
  status: string;
  createdOn: string;
  lastEditedOn: string;
}

@Component({
  selector: 'app-summary-dup',
  templateUrl: './summary-dup.component.html',
  styleUrls: ['./summary-dup.component.scss']
})
export class SummaryDupComponent implements OnInit {

  displayedColumns = ['id', 'organisation', 'title', 'status', 'actions'];
  dataSource: MatTableDataSource<DataUseProcess>;
  organizationList:[] = [];
  statusList:[] = [];
  @Input() user: string = 'internal';
  filterOption: string = '';
  searchText:string = '';
  dupLength: number = 0;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor( private dtpService: DtpService, private dupService:DupService, private spinner: NgxSpinnerService, private toastr: ToastrService) {
  }

  ngOnInit() {
    this.getDupList();
    this.getOrganization();
    this.getStatus();
  }
  getDupList() {
    this.spinner.show();
    this.dupService.getDupList().subscribe((res: any) => {
      this.spinner.hide();
      if (res && res.data) {
        this.dataSource = new MatTableDataSource(res.data);
      } else {
        this.dataSource = new MatTableDataSource();
      }
      this.dataSource.paginator = this.paginator;
      this.searchText = '';
    }, error => {
      this.spinner.hide();
      this.toastr.error(error.error.title);
    })
  }
  getOrganization() {
    setTimeout(() => {
     this.spinner.show(); 
    });
    this.dtpService.getOrganizationList().subscribe((res: any) => {
      this.spinner.hide();
      if (res && res.data) {
        this.organizationList = res.data;
      }
    }, error => {
      this.spinner.hide();
      this.toastr.error(error.error.title);
    })
  }
  getStatus() {
    setTimeout(() => {
     this.spinner.show(); 
    });
    this.dupService.getStatusList().subscribe((res: any) => {
      this.spinner.hide();
      if (res && res.data) {
        this.statusList = res.data;
      }
    }, error => {
      this.spinner.hide();
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

  filterSearch() {
    const payload = {
      page: 1,
      size: 10,
      title: this.searchText
    }
    if (this.filterOption === 'title' && this.searchText !== '') {
      this.spinner.show();
      this.dtpService.filterByTitle(payload).subscribe((res: any) => {
        this.spinner.hide()
        if (res && res.data) {
          this.dataSource = res.data;
          this.dupLength = res.total;
        } else {
          this.dataSource = new MatTableDataSource();
        }
      }, error => {
        this.spinner.hide();
        this.toastr.error(error.error.title);
      })
    }
  } 
  @HostListener('window:storage', ['$event'])
  refreshList(event) {
    console.log('event triggered', event)
    this.getDupList();
    localStorage.removeItem('updateDupList');
  }
}
