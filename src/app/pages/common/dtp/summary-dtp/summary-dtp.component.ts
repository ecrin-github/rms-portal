import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
export interface DataTransfer {
  id: string;
  organisation: string;
  dataObject: string;
  status: string;
  createdOn: string;
  lastEditedOn: string;
}

@Component({
  selector: 'app-summary-dtp',
  templateUrl: './summary-dtp.component.html',
  styleUrls: ['./summary-dtp.component.scss']
})

export class SummaryDtpComponent implements OnInit {
  displayedColumns = ['id', 'organisation', 'dataObject', 'status', 'createdOn', 'lastEditedOn', 'actions'];
  dataSource: MatTableDataSource<DataTransfer>;
  STATUSES = ['Approved', 'Rejected', 'In progress', 'Success'];

  @Input() user: string = 'internal';

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor() {
    // Create 100 ongoing requests
    const transfers: DataTransfer[] = [];
    for (let i = 1; i <= 100; i++) { transfers.push(this.generateTransfers(i)); }
    this.dataSource = new MatTableDataSource(transfers);
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  generateTransfers(id: number): DataTransfer {

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
