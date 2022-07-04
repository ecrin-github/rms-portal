import { Component, HostListener, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { DashboardService } from 'src/app/_rms/services/entities/dashboard/dashboard.service';
import { DataObjectService } from 'src/app/_rms/services/entities/data-object/data-object.service';
import { StudyService } from 'src/app/_rms/services/entities/study/study.service';
export interface ObjectRecord {
  id: number;
  title: string;
  type: string;
  linkedStudyId: number;
}
@Component({
  selector: 'app-recent-objects',
  templateUrl: './recent-objects.component.html',
})
export class RecentObjectsComponent {
  @Input() cssClass;
  displayedColumns = ['id', 'title', 'type', 'linkedStudy', 'actions'];
  dataSource: MatTableDataSource<ObjectRecord>;
  objectType: [] = [];
  studyList: [] = [];
  totalObject: any;

  constructor( private objectService: DataObjectService, private toastr: ToastrService, private studyService: StudyService, private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.getObjectList();
    this.getObjectType();
    this.getStudy();
    this.getStatistics();
  }
  getStatistics() {
    this.dashboardService.getObjectStatistics().subscribe((res: any) => {
      this.totalObject = res.total;
    }, error => {
      this.toastr.error(error.error.title);
    })
  }
  getObjectList() {
    const payload = {
      page: 1,
      size: 10
    }
    this.dashboardService.paginationObject(payload).subscribe((res: any) => {
      if (res && res.data) {
        this.dataSource = new MatTableDataSource(res.data);
      } else {
        this.dataSource = new MatTableDataSource();
      }
    }, error => {
      this.toastr.error(error.error.title);
    })
  }
  getObjectType() {
    this.objectService.getObjectType().subscribe((res: any) => {
      if (res && res.data) {
        this.objectType = res.data
      }
    }, error => {
      this.toastr.error(error.error.title);
    })
  }
  getStudy() {
    this.studyService.getStudy().subscribe((res: any) => {
      if (res && res.data) {
        this.studyList = res.data;
      }
    }, error => {
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
  @HostListener('window:storage', ['$event'])
  refreshList(event) {
    console.log('event triggered', event)
    this.getObjectList();
  }
}
