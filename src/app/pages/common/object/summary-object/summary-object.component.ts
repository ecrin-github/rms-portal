import { Component, HostListener, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxPermissionsService } from 'ngx-permissions';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ObjectListEntryInterface } from 'src/app/_rms/interfaces/data-object/data-object-listentry.interface';
import { DataObjectService } from 'src/app/_rms/services/entities/data-object/data-object.service';
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
  title: string = '';
  warningModal: any;
  role: any;
  orgId: any;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild('objectDeleteModal') objectDeleteModal : TemplateRef<any>;

  constructor( private listService: ListService, 
               private spinner: NgxSpinnerService, 
               private toastr: ToastrService, 
               private modalService: NgbModal,
               private dataObjectService: DataObjectService,
               private permissionService: NgxPermissionsService) {
  }

  ngOnInit(): void {
    if (localStorage.getItem('role')) {
      this.role = localStorage.getItem('role');
      this.permissionService.loadPermissions([this.role]);
    }
    if (localStorage.getItem('organisationId')) {
      this.orgId = localStorage.getItem('organisationId');
    }
    this.getObjectList();
  }
  
  getAllObjectList() {
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
    getObjectListByOrg() {
    this.listService.getObjectListByOrg(this.orgId).subscribe((res: any) => {
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
  getObjectList() {
    if (this.role === 'User') {
      this.getObjectListByOrg();
    } else {
      this.getAllObjectList();
    }
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
    this.dataObjectService.objectInvolvement(id).subscribe((res: any) => {
      if (res && res.data) {
        const dtpLinked = res.data[0].statValue;
        const dupLinked = res.data[1].statValue;  
        if (dtpLinked > 0 && dupLinked > 0) {
          this.title = `There are ${dtpLinked} DTP's and ${dupLinked} DUP's linked to this object. So you can't delete the object`;
          this.warningModal = this.modalService.open(this.objectDeleteModal, { size: 'lg', backdrop: 'static' });
        } else if (dtpLinked > 0) {
          this.title = `There are ${dtpLinked} DTP's linked to this object. So you can't delete the object`;
          this.warningModal = this.modalService.open(this.objectDeleteModal, { size: 'lg', backdrop: 'static' });
        } else if (dupLinked > 0) {
          this.title = ` There are ${dupLinked} DUP's linked to this object. So you can't delete the object`;
          this.warningModal = this.modalService.open(this.objectDeleteModal, { size: 'lg', backdrop: 'static' });
        } else {
          const deleteModal = this.modalService.open(ConfirmationWindowComponent, { size: 'lg', backdrop: 'static' });
          deleteModal.componentInstance.type = 'dataObject';
          deleteModal.componentInstance.id = id;
          deleteModal.result.then((data: any) => {
            if (data) {
              this.getObjectList();
            }
          }, error => { });
        }
      } else {
        const deleteModal = this.modalService.open(ConfirmationWindowComponent, { size: 'lg', backdrop: 'static' });
        deleteModal.componentInstance.type = 'dataObject';
        deleteModal.componentInstance.id = id;
        deleteModal.result.then((data: any) => {
          if (data) {
            this.getObjectList();
          }
        }, error => { });
      }
    }, error => {
      this.toastr.error(error.error.title);
    });
  }
  closeModal() {
    this.warningModal.close();
  }
}
