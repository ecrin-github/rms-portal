import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-recent-data-transfers',
  templateUrl: './recent-data-transfers.component.html',
})
export class RecentDataTransfersComponent {
  @Input() cssClass;

  constructor() { }
}
