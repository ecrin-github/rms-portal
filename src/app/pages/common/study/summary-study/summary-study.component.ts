import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { StudyService } from 'src/app/_rms/services/entities/study/study.service';
export interface StudyRecord {
  id: number;
  title: string;
  type: string;
  status: string;
}

@Component({
  selector: 'app-summary-study',
  templateUrl: './summary-study.component.html',
  styleUrls: ['./summary-study.component.scss']
})
export class SummaryStudyComponent implements OnInit {

  displayedColumns = ['id', 'title', 'type', 'status', 'actions'];
  dataSource: MatTableDataSource<StudyRecord>;
  @Input() user: string = 'internal';
  studyTypes: [] = [];
  studyStatus: [] = [];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor( private studyService: StudyService, private spinner: NgxSpinnerService, private toastr: ToastrService) {
  }


  ngOnInit(): void {
    this.getStudyList();
    this.getStudyType();
    this.getStudyStatus();
  }
  getStudyList() {
    this.spinner.show();
    this.studyService.getStudy().subscribe((res: any) => {
      this.spinner.hide();
      if (res && res.data) {
        this.dataSource = new MatTableDataSource(res.data);
      } else {
        this.dataSource = new MatTableDataSource();
      }
      this.dataSource.paginator = this.paginator;
    }, error => {
      this.spinner.hide();
      this.toastr.error(error.error.title);
    })
  }
  getStudyType() {
    setTimeout(() => {
      this.spinner.show(); 
    });
    this.studyService.getStudyType().subscribe((res: any) => {
      this.spinner.hide();
      if (res && res.data) {
        this.studyTypes = res.data;
      }
    }, error => {
      this.spinner.hide();
      this.toastr.error(error.error.title);
    })
  }
  getStudyStatus() {
    setTimeout(() => {
     this.spinner.show();; 
    });
    this.studyService.getStudyStatus().subscribe((res: any) => {
      this.spinner.hide();
      if (res && res.data) {
        this.studyStatus = res.data
      }
    }, error => {
      this.spinner.hide();
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
  // generateStudies(recordsNumber: number): Array<StudyRecord> {
  //   const records: Array<StudyRecord> = [];
  //   for (let i = 1; i < recordsNumber; i++) {
  //     records.push({
  //       id: i,
  //       title: 'Study title ' + i.toString(),
  //       type: 'Type',
  //       status: 'Status'
  //     });
  //   }
  //   return records;
  // }

}
