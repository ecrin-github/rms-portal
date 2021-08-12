import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-recent-dup',
  templateUrl: './recent-dup.component.html',
})
export class RecentDupComponent {
  @Input() cssClass;

  constructor() { }
}
