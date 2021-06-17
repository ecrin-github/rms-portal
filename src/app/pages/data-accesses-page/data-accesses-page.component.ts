import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';


@Component({
    selector: 'app-data-accesses',
    templateUrl: './data-accesses-page.component.html'
})
export class DataAccessesPageComponent implements OnInit {

    displayedColumns = ['dataAccessRequest', 'dataTransfer', 'dta', 'requester', 'status'];
    dataSource: MatTableDataSource<AccessRequest>;

    newRequestsDisplayedColumns = ['dataAccessRequest', 'dataTransfer', 'dta', 'requester', 'date'];
    newRequestsSource: MatTableDataSource<NewAccessRequest>;

    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

    constructor(private modalService: NgbModal) {
        // Create 100 ongoing requests
        const requests: AccessRequest[] = [];
        for (let i = 1; i <= 100; i++) { requests.push(generateAccessRequests(i)); }
        this.dataSource = new MatTableDataSource(requests);

        // Create 50 new requests
        const newRequests: NewAccessRequest[] = [];
        for (let i = 1; i <= 50; i++) { newRequests.push(generateNewAccessRequests(i)); }
        this.newRequestsSource = new MatTableDataSource(newRequests);
    }

    ngOnInit() {
        this.dataSource.paginator = this.paginator;
        this.newRequestsSource.paginator = this.paginator;
    }

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
        this.dataSource.filter = filterValue;
        this.newRequestsSource.filter = filterValue;
    }

    openLarge(content) {
        this.modalService.open(content, {
            size: 'lg'
        });
    }

}


/** Builds and returns a new User. */
function generateAccessRequests(id: number): AccessRequest {
    const name =
        NAMES[Math.round(Math.random() * (NAMES.length - 1))] + ' ' +
        NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) + '.';

    const status = STATUSES[Math.round(Math.random() * (STATUSES.length - 1))];


    return {
        id: id.toString(),
        dataAccessRequest: 'Access request ' + id.toString(),
        dataTransfer: 'Data transfer ' + id.toString(),
        dta: 'Agreement ' + id.toString(),
        requester: name + ' (Organization)',
        status,
    };
}

function generateNewAccessRequests(id: number): NewAccessRequest {
    const name =
        NAMES[Math.round(Math.random() * (NAMES.length - 1))] + ' ' +
        NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) + '.';

    const date = new Date();

    return {
        id: id.toString(),
        dataAccessRequest: 'Access request ' + id.toString(),
        dataTransfer: 'Data transfer ' + id.toString(),
        dta: 'Agreement ' + id.toString(),
        requester: name + ' (Organization)',
        date: date.getDate().toString() + '/' + date.getMonth().toString() + '/' + date.getFullYear().toString(),
    };
}


/** Constants used to fill up our data base. */
const NAMES = ['Maia', 'Asher', 'Olivia', 'Atticus', 'Amelia', 'Jack',
    'Charlotte', 'Theodore', 'Isla', 'Oliver', 'Isabella', 'Jasper',
    'Cora', 'Levi', 'Violet', 'Arthur', 'Mia', 'Thomas', 'Elizabeth'];
const STATUSES = ['Approved', 'Rejected', 'In progress', 'Success'];

export interface AccessRequest {
    id: string;
    dataAccessRequest: string;
    dataTransfer: string;
    dta: string;
    requester: string;
    status: string;
}

export interface NewAccessRequest {
    id: string;
    dataAccessRequest: string;
    dataTransfer: string;
    dta: string;
    requester: string;
    date: string;
}
