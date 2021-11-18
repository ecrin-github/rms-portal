import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
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

  constructor() {
    this.dataSource = new MatTableDataSource(this.generateStudies(100));
  }


  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  generateStudies(recordsNumber: number): Array<StudyRecord> {
    const records: Array<StudyRecord> = [];
    for (let i = 1; i < recordsNumber; i++) {
      records.push({
        id: i,
        title: 'Study title ' + i.toString(),
        type: 'Type',
        status: 'Status'
      });
    }
    return records;
  }

}
