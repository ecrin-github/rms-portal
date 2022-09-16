import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationWindowComponent } from '../../confirmation-window/confirmation-window.component';
import { StudyListEntryInterface } from 'src/app/_rms/interfaces/study/study-listentry.interface';
import { ListService } from 'src/app/_rms/services/entities/list/list.service';

@Component({
  selector: 'app-summary-study',
  templateUrl: './summary-study.component.html',
  styleUrls: ['./summary-study.component.scss']
})

export class SummaryStudyComponent implements OnInit {

  displayedColumns = ['id', 'title', 'type', 'status', 'actions'];
  dataSource: MatTableDataSource<StudyListEntryInterface>;
  filterOption: string = '';
  searchText:string = '';
  studyLength: number = 0;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  constructor( private listService: ListService, 
               private spinner: NgxSpinnerService, 
               private toastr: ToastrService, 
               private modalService: NgbModal) {
  }

  ngOnInit(): void {
    this.getStudyList();
  }

  getStudyList() {
    this.spinner.show();
    this.listService.getStudyList().subscribe((res: any) => {
      this.spinner.hide();
      if (res && res.data) {
        this.dataSource = new MatTableDataSource<StudyListEntryInterface>(res.data);
        this.studyLength = res.total;
      } else {
        this.dataSource = new MatTableDataSource();
        this.studyLength = res.total;
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
      this.listService.getFilteredStudyList(title_fragment, page, size).subscribe((res: any) => {
        this.spinner.hide()
        if (res && res.data) {
          this.dataSource = new MatTableDataSource<StudyListEntryInterface>(res.data);
          // this.studyLength = res.totalRecords; // use this for database-paged record retrieval
          this.studyLength = res.total
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
    this.getStudyList();
    localStorage.removeItem('updateStudyList');
  }

  deleteRecord(id) {
    const deleteModal = this.modalService.open(ConfirmationWindowComponent, {size: 'lg', backdrop: 'static'});
    deleteModal.componentInstance.type = 'study';
    deleteModal.componentInstance.id = id;
    deleteModal.result.then((data: any) => {
      if(data) {
        this.getStudyList();
      }
    }, error => {});
  }
}
