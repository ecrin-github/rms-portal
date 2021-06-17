import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-recent-objects',
  templateUrl: './recent-objects.component.html',
})
export class RecentObjectsComponent implements OnInit {

  @Input() cssClass: string;

  constructor() { }

  ngOnInit(): void {}

}
