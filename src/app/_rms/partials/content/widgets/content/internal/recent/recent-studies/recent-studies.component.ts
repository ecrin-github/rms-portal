import { Component, HostListener, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { DashboardService } from 'src/app/_rms/services/entities/dashboard/dashboard.service';
import { StudyService } from 'src/app/_rms/services/entities/study/study.service';
export interface StudyRecord {
  id: number;
  title: string;
  type: string;
  status: string;
}

@Component({
  selector: 'app-recent-studies',
  templateUrl: './recent-studies.component.html',
})
export class RecentStudiesComponent {
  @Input() cssClass;
  displayedColumns = ['id', 'title', 'type', 'status', 'actions'];
  dataSource: MatTableDataSource<StudyRecord>;
  studyTypes: [] = [];
  studyStatus: [] = [];
  totalData: any;


  constructor( private dashboardService: DashboardService, private studyService: StudyService, private toastr: ToastrService) { }

  ngOnInit() {
    this.getStudyList();
    this.getStudyType();
    this.getStudyStatus();
    this.getStatistics();
  }
  getStatistics() {
    this.dashboardService.getStudyStatistics().subscribe((res: any) => {
      this.totalData = res.total;
    }, error => {
      this.toastr.error(error.error.title);
    })
  }
  getStudyList() {
    const payload = {
      page: 1,
      size: 10
    }
    this.dashboardService.paginationStudies(payload).subscribe((res: any) => {
      if (res && res.data) {
        this.dataSource = new MatTableDataSource(res.data);
      } else {
        this.dataSource = new MatTableDataSource();
      }
    }, error => {
      this.toastr.error(error.error.title);
    })
  }
  getStudyType() {
    this.studyService.getStudyType().subscribe((res: any) => {
      if (res && res.data) {
        this.studyTypes = res.data;
      }
    }, error => {
      this.toastr.error(error.error.title);
    })
  }
  getStudyStatus() {
    this.studyService.getStudyStatus().subscribe((res: any) => {
      if (res && res.data) {
        this.studyStatus = res.data
      }
    }, error => {
      this.toastr.error(error.error.title);
    })
  }
  findStudyType(id) {
    const studyTypeArray: any = this.studyTypes.filter((type: any) => type.id === id);
    return studyTypeArray && studyTypeArray.length ? studyTypeArray[0].name : '';
  }
  findStudyStatus(id) {
    const studyStatusArray: any = this.studyStatus.filter((type: any) => type.id === id);
    return studyStatusArray && studyStatusArray.length ? studyStatusArray[0].name : '';
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  @HostListener('window:storage', ['$event'])
  refreshList(event) {
    console.log('event triggered', event)
    this.getStudyList();
  }
}
