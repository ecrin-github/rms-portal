import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-recent-studies',
  templateUrl: './recent-studies.component.html',
})
export class RecentStudiesComponent {
  @Input() cssClass;

  constructor() { }
}
