import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
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
  @Input() user: string = 'internal';

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor() {
    this.dataSource = new MatTableDataSource(this.generateObjects(100));
  }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  generateObjects(recordsNumber: number): Array<ObjectRecord> {
    const records: Array<ObjectRecord> = [];
    for (let i = 1; i < recordsNumber; i++) {
      records.push({
        id: i,
        title: 'Object title ' + i.toString(),
        type: 'Type',
        linkedStudyId: i
      });
    }
    return records;
  }

}
