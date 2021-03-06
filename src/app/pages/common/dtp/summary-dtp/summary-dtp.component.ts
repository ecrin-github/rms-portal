import { Component, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { DtpService } from 'src/app/_rms/services/entities/dtp/dtp.service';
import { ConfirmationWindowComponent } from '../../confirmation-window/confirmation-window.component';
export interface DataTransfer {
  id: string;
  organisation: string;
  dataObject: string;
  status: string;
  createdOn: string;
  lastEditedOn: string;
}

@Component({
  selector: 'app-summary-dtp',
  templateUrl: './summary-dtp.component.html',
  styleUrls: ['./summary-dtp.component.scss']
})

export class SummaryDtpComponent implements OnInit {
  displayedColumns = ['id', 'organisation', 'title', 'status', 'actions'];
  dataSource: MatTableDataSource<DataTransfer>;
  organizationList: [] = [];
  statusList: [] = [];
  filterOption: string = '';
  searchText:string = '';
  dtpLength: number = 0;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor( private dtpService: DtpService, private spinner: NgxSpinnerService, private toastr: ToastrService, private modalService: NgbModal) {
  }

  ngOnInit() {
    this.getDtpList();
    this.getOrganization();
    this.getStatus();
  }
  getDtpList() {
    this.spinner.show();
    this.dtpService.getDtpList().subscribe((res: any) => {
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
      this.toastr.error(error.error.title)
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
    this.dtpService.getStatusList().subscribe((res: any) => {
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
          this.dtpLength = res.total;
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
    this.getDtpList();
    localStorage.removeItem('updateDtpList');
  }
  deleteRecord(id) {
    const deleteModal = this.modalService.open(ConfirmationWindowComponent, {size: 'lg', backdrop: 'static'});
    deleteModal.componentInstance.type = 'dtp';
    deleteModal.componentInstance.id = id;
    deleteModal.result.then((data: any) => {
      console.log('data', data)
      if (data) {
        this.getDtpList();
      }
    }, error => {});
  }
}
