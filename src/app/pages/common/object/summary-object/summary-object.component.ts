import { Component, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ObjectListEntryInterface } from 'src/app/_rms/interfaces/data-object/data-object-listentry.interface';
import { ListService } from 'src/app/_rms/services/entities/list/list.service';
import { ConfirmationWindowComponent } from '../../confirmation-window/confirmation-window.component';

@Component({
  selector: 'app-summary-object',
  templateUrl: './summary-object.component.html',
  styleUrls: ['./summary-object.component.scss']
})
export class SummaryObjectComponent implements OnInit {

  displayedColumns = ['id', 'title', 'type', 'linkedStudy', 'actions'];
  dataSource: MatTableDataSource<ObjectListEntryInterface>;
  filterOption: string = '';
  searchText:string = '';
  objectLength: number = 0;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  constructor( private listService: ListService, 
               private spinner: NgxSpinnerService, 
               private toastr: ToastrService, 
               private modalService: NgbModal) {
  }

  ngOnInit(): void {
    this.getObjectList();
  }
  
  getObjectList() {
    this.listService.getObjectList().subscribe((res: any) => {
      this.spinner.hide();
      if (res && res.data) {
        this.dataSource = new MatTableDataSource<ObjectListEntryInterface>(res.data);
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
    if (this.filterOption === 'title' && this.searchText != '') {
      this.spinner.show();
      this.listService.getFilteredObjectList(title_fragment, page, size).subscribe((res: any) => {
        this.spinner.hide();
        if (res && res.data) {
          this.dataSource = new MatTableDataSource<ObjectListEntryInterface>(res.data);
          this.objectLength = res.total;
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
    this.getObjectList();
    localStorage.removeItem('updateObjectList');
  }

  deleteRecord(id) {
    const deleteModal = this.modalService.open(ConfirmationWindowComponent, {size: 'lg', backdrop: 'static'});
    deleteModal.componentInstance.type = 'dataObject';
    deleteModal.componentInstance.id = id;
    deleteModal.result.then((data: any) => {
      if (data) {
        this.getObjectList();
      }
    }, error => {});
  }
}
