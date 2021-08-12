import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';


@Component({
    selector: 'app-objects-summary-internal',
    templateUrl: './objects-summary-internal.component.html'
})
export class ObjectsSummaryInternalComponent implements OnInit {

    displayedColumns = ['id', 'title', 'type', 'linkedStudy', 'actions'];
    dataSource: MatTableDataSource<ObjectRecord>;

    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

    constructor() {
        this.dataSource = new MatTableDataSource(generateObjects(100));
    }

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
        this.dataSource.filter = filterValue;
    }


    ngOnInit(): void {
        this.dataSource.paginator = this.paginator;
    }
}

export interface ObjectRecord {
    id: number;
    title: string;
    type: string;
    linkedStudyId: number;
}

function generateObjects(recordsNumber: number): Array<ObjectRecord> {
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
