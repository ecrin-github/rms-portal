import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
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

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor( private studyService: StudyService) {
  }


  ngOnInit(): void {
    this.getStudyList();
  }
  getStudyList() {
    this.studyService.getStudy().subscribe((res: any) => {
      console.log('res', res);
      if (res && res.data) {
        this.dataSource = new MatTableDataSource(res.data);
      } else {
        this.dataSource = new MatTableDataSource();
      }
      this.dataSource.paginator = this.paginator;
    }, error => {
      console.log('error', error);
    })
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
