import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';


@Component({
    selector: 'app-dtp-summary-external',
    templateUrl: './dtp-summary-external.component.html'
})
export class DtpSummaryExternalComponent implements OnInit {

    displayedColumns = ['id', 'organisation', 'dataObject', 'status', 'createdOn', 'lastEditedOn', 'actions'];
    dataSource: MatTableDataSource<DataTransfer>;

    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

    constructor() {
        // Create 100 ongoing requests
        const transfers: DataTransfer[] = [];
        for (let i = 1; i <= 100; i++) { transfers.push(generateTransfers(i)); }
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

}


/** Builds and returns a new transfers. */
function generateTransfers(id: number): DataTransfer {

    const status = STATUSES[Math.round(Math.random() * (STATUSES.length - 1))];

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


/** Constants used to fill up our data base. */
const STATUSES = ['Approved', 'Rejected', 'In progress', 'Success'];

export interface DataTransfer {
    id: string;
    organisation: string;
    dataObject: string;
    status: string;
    createdOn: string;
    lastEditedOn: string;
}
