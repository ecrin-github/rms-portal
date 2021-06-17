import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-recent-studies',
  templateUrl: './recent-studies.component.html',
})
export class RecentStudiesComponent implements OnInit {

  @Input() cssClass: string;

  constructor() { }

  ngOnInit(): void {}

}
