import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';


@Component({
    selector: 'app-data-transfers',
    templateUrl: './data-transfers-page.component.html'
})
export class DataTransfersPageComponent implements OnInit {

    displayedColumns = ['dataTransfer', 'dataObject', 'dta', 'contributor', 'status'];
    dataSource: MatTableDataSource<DataTransfer>;

    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

    constructor(private modalService: NgbModal) {
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

    openLarge(content) {
        this.modalService.open(content, {
            size: 'lg'
        });
    }

}


/** Builds and returns a new transfers. */
function generateTransfers(id: number): DataTransfer {
    const name =
        NAMES[Math.round(Math.random() * (NAMES.length - 1))] + ' ' +
        NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) + '.';

    const status = STATUSES[Math.round(Math.random() * (STATUSES.length - 1))];


    return {
        id: id.toString(),
        dataTransfer: 'Data transfer ' + id.toString(),
        dataObject: 'Object ' + id.toString(),
        dta: 'Agreement ' + id.toString(),
        contributor: name + ' (Organization)',
        status,
    };
}


/** Constants used to fill up our data base. */
const NAMES = ['Maia', 'Asher', 'Olivia', 'Atticus', 'Amelia', 'Jack',
    'Charlotte', 'Theodore', 'Isla', 'Oliver', 'Isabella', 'Jasper',
    'Cora', 'Levi', 'Violet', 'Arthur', 'Mia', 'Thomas', 'Elizabeth'];
const STATUSES = ['Approved', 'Rejected', 'In progress', 'Success'];

export interface DataTransfer {
    id: string;
    dataTransfer: string;
    dataObject: string;
    dta: string;
    contributor: string;
    status: string;
}
