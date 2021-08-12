import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-recent-objects',
  templateUrl: './recent-objects.component.html',
})
export class RecentObjectsComponent {
  @Input() cssClass;

  constructor() { }
}
