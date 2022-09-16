import { Component, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ListService } from 'src/app/_rms/services/entities/list/list.service';
import { ConfirmationWindowComponent } from '../../confirmation-window/confirmation-window.component';
import { DupListEntryInterface } from 'src/app/_rms/interfaces/dup/dup-listentry.interface';

@Component({
  selector: 'app-summary-dup',
  templateUrl: './summary-dup.component.html',
  styleUrls: ['./summary-dup.component.scss']
})
export class SummaryDupComponent implements OnInit {

  displayedColumns = ['id', 'organisation', 'title', 'status', 'actions'];
  dataSource: MatTableDataSource<DupListEntryInterface>;
  filterOption: string = '';
  searchText:string = '';
  dupLength: number = 0;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  constructor( private listService: ListService, 
               private spinner: NgxSpinnerService, 
               private toastr: ToastrService, 
               private modalService: NgbModal) {
  }

  ngOnInit() {
    this.getDupList();
  }

  getDupList() {
    this.spinner.show();
    this.listService.getDupList().subscribe((res: any) => {
      this.spinner.hide();
      if (res && res.data) {
        this.dataSource = new MatTableDataSource<DupListEntryInterface>(res.data);
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
  
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  filterSearch() {
    let page = 1; let size = 10; // though not currently used
    let title_fragment = this.searchText;
    if (this.filterOption === 'title' && this.searchText !== '') {
      this.spinner.show();
      this.listService.getFilteredDuptList(title_fragment, page, size).subscribe((res: any) => {
        this.spinner.hide()
        if (res && res.data) {
          this.dataSource = new MatTableDataSource<DupListEntryInterface>(res.data);
          this.dupLength = res.total;
        } else {
          this.dataSource = new MatTableDataSource();
        }
        this.dataSource.paginator = this.paginator;
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

  deleteRecord(id) {
    const deleteModal = this.modalService.open(ConfirmationWindowComponent, {size: 'lg', backdrop: 'static'});
    deleteModal.componentInstance.type = 'dup';
    deleteModal.componentInstance.id = id;
    deleteModal.result.then((data: any) => {
      if (data) {
        this.getDupList();
      }
    }, error => {});
  }
}
