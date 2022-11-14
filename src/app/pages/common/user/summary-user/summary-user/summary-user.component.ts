import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ListService } from 'src/app/_rms/services/entities/list/list.service';
import { PeopleService } from 'src/app/_rms/services/entities/people/people.service';
import { ConfirmationWindowComponent } from '../../../confirmation-window/confirmation-window.component';

@Component({
  selector: 'app-summary-user',
  templateUrl: './summary-user.component.html',
  styleUrls: ['./summary-user.component.scss']
})
export class SummaryUserComponent implements OnInit {

  displayedColumns = ['name', 'roleName', 'orgName', 'actions'];
  dataSource: MatTableDataSource<any>;
  peopleLength: number = 0;
  searchText: string = '';
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  constructor( private listService: ListService, private spinner: NgxSpinnerService, private toastr: ToastrService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.getPeople();
  }
  getPeople() {
    this.spinner.show();
    this.listService.getPeopleList().subscribe((res: any) => {
      this.spinner.hide();
      if (res && res.data) {
        this.dataSource = new MatTableDataSource<any>(res.data);
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
    let people_fragment = this.searchText;
    this.spinner.show();
    this.listService.getFilteredPeopleList(people_fragment, page, size).subscribe((res: any) => {
      this.spinner.hide()
      if (res && res.data) {
        this.dataSource = new MatTableDataSource<any>(res.data);
        this.peopleLength = res.total;
      } else {
        this.dataSource = new MatTableDataSource();
      }
      this.dataSource.paginator = this.paginator;
    }, error => {
      this.spinner.hide();
      this.toastr.error(error.error.title);
    })
  }
  deleteRecord(id) {
    const  deleteModal = this.modalService.open(ConfirmationWindowComponent, {size: 'lg', backdrop: 'static'});
    deleteModal.componentInstance.type = 'people';
    deleteModal.componentInstance.peopleId = id;
    deleteModal.result.then((data: any) => {
      if (data) {
        this.getPeople();
      }
    })
  }
  @HostListener('window: storage', ['$event'])
  refreshList(event) {
    console.log('event triggered', event);
    this.getPeople();
    localStorage.removeItem('updateUserList');
  }
}
