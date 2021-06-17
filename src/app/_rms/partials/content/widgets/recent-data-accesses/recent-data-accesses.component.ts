import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-recent-data-accesses',
  templateUrl: './recent-data-accesses.component.html',
})
export class RecentDataAccessesComponent {
  @Input() cssClass;

  constructor() {}

}
