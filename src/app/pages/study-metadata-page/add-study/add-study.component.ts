import {Component, OnInit} from '@angular/core';


@Component({
    selector: 'app-add-study',
    templateUrl: './add-study.component.html'
})
export class AddStudyComponent implements OnInit {
    public isCollapsed = false;

    constructor() {
    }

    ngOnInit(): void {
    }

}
