import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-recent-users',
  templateUrl: './recent-users.component.html',
})
export class RecentUsersComponent {
  @Input() cssClass;

  constructor() { }
}
