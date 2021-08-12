import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-recent-dtu',
  templateUrl: './recent-dtu.component.html',
})
export class RecentDtuComponent {
  @Input() cssClass;

  constructor() { }
}
