import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
export interface DataUseProcess {
  id: string;
  organisation: string;
  dataObject: string;
  status: string;
  createdOn: string;
  lastEditedOn: string;
}

@Component({
  selector: 'app-summary-dup',
  templateUrl: './summary-dup.component.html',
  styleUrls: ['./summary-dup.component.scss']
})
export class SummaryDupComponent implements OnInit {

  displayedColumns = ['id', 'organisation', 'dataObject', 'status', 'createdOn', 'lastEditedOn', 'actions'];
  dataSource: MatTableDataSource<DataUseProcess>;
  STATUSES = ['Approved', 'Rejected', 'In progress', 'Success'];

  @Input() user: string = 'internal';

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor() {
    // Create 100 ongoing requests
    const dataUses: DataUseProcess[] = [];
    for (let i = 1; i <= 100; i++) { dataUses.push(this.generateData(i)); }
    this.dataSource = new MatTableDataSource(dataUses);
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  generateData(id: number): DataUseProcess {

    const status = this.STATUSES[Math.round(Math.random() * (this.STATUSES.length - 1))];

    const date = new Date();

    return {
      id: id.toString(),
      organisation: 'Organisation ' + id.toString(),
      dataObject: 'Object ' + id.toString(),
      createdOn: date.getDay() + '/' + date.getMonth() + '/' + date.getFullYear(),
      lastEditedOn: date.getDay() + '/' + date.getMonth() + '/' + date.getFullYear(),
      status,
    };
  }

}
