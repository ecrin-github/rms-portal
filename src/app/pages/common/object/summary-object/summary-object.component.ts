import { Component, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { DataObjectService } from 'src/app/_rms/services/entities/data-object/data-object.service';
import { StudyService } from 'src/app/_rms/services/entities/study/study.service';
export interface ObjectRecord {
  id: number;
  title: string;
  type: string;
  linkedStudyId: number;
}

@Component({
  selector: 'app-summary-object',
  templateUrl: './summary-object.component.html',
  styleUrls: ['./summary-object.component.scss']
})
export class SummaryObjectComponent implements OnInit {

  displayedColumns = ['id', 'title', 'type', 'linkedStudy', 'actions'];
  dataSource: MatTableDataSource<ObjectRecord>;
  objectType: [] = [];
  studyList: [] = [];
  @Input() user: string = 'internal';
  filterOption: string = '';
  searchText:string = '';
  objectLength: number = 0;


  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor( private objectService: DataObjectService, private spinner: NgxSpinnerService, private toastr: ToastrService, private studyService: StudyService) {
  }

  ngOnInit(): void {
    this.getObjectList();
    this.getObjectType();
    this.getStudy();
  }
  getObjectList() {
    this.objectService.getObject().subscribe((res: any) => {
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
  getObjectType() {
    setTimeout(() => {
     this.spinner.show(); 
    });
    this.objectService.getObjectType().subscribe((res: any) => {
      this.spinner.hide();
      if (res && res.data) {
        this.objectType = res.data
      }
    }, error => {
      this.spinner.hide();
      this.toastr.error(error.error.title);
    })
  }
  getStudy() {
    setTimeout(() => {
     this.spinner.show(); 
    });
    this.studyService.getStudy().subscribe((res: any) => {
      this.spinner.hide();
      if (res && res.data) {
        this.studyList = res.data;
      }
    }, error => {
      this.spinner.hide();
      this.toastr.error(error.error.title);
    })
  }
  findObjectType(id) {
    const objectTypeArray: any = this.objectType.filter((type: any) => type.id === id);
    return objectTypeArray && objectTypeArray.length ? objectTypeArray[0].name : '';
  }
  findStudy(id) {
    const studyArray: any = this.studyList.filter((type: any) => type.sdSid === id);
    return studyArray && studyArray.length ? studyArray[0].displayTitle : '';
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
    if (this.filterOption === 'title' && this.searchText != '') {
      this.spinner.show();
      this.objectService.filterByTitle(payload).subscribe((res: any) => {
        this.spinner.hide();
        if (res && res.data) {
          this.dataSource = res.data;
          this.objectLength = res.total;
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
    this.getObjectList();
    localStorage.removeItem('updateObjectList');
  }

}
