import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';


@Component({
    selector: 'app-dup-summary-internal',
    templateUrl: './dup-summary-internal.component.html'
})
export class DupSummaryInternalComponent implements OnInit {

    displayedColumns = ['id', 'organisation', 'dataObject', 'status', 'createdOn', 'lastEditedOn', 'actions'];
    dataSource: MatTableDataSource<DataUseProcess>;

    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

    constructor() {
        // Create 100 ongoing requests
        const dataUses: DataUseProcess[] = [];
        for (let i = 1; i <= 100; i++) { dataUses.push(generateData(i)); }
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

}


/** Builds and returns a new data uses. */
function generateData(id: number): DataUseProcess {

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

const STATUSES = ['Approved', 'Rejected', 'In progress', 'Success'];

export interface DataUseProcess {
    id: string;
    organisation: string;
    dataObject: string;
    status: string;
    createdOn: string;
    lastEditedOn: string;
}
