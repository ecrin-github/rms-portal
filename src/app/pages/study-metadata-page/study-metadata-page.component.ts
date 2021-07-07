import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';


@Component({
    selector: 'app-study-metadata',
    templateUrl: './study-metadata-page.component.html'
})
export class StudyMetadataPageComponent implements OnInit {

    displayedColumns = ['id', 'title', 'type', 'status', 'actions'];
    dataSource: MatTableDataSource<StudyRecord>;

    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

    constructor() {
        this.dataSource = new MatTableDataSource(generateStudies(100));
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

export interface StudyRecord {
    id: number;
    title: string;
    type: string;
    status: string;
}

function generateStudies(recordsNumber: number): Array<StudyRecord> {
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
