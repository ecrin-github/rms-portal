import { Component, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-recent-users',
  templateUrl: './recent-users.component.html',
})
export class RecentUsersComponent {
  @Input() cssClass;
  @Input() peopleTotal: number = 0;
  displayedColumns = ['name', 'role', 'email', 'location', 'actions'];
  dataSource: MatTableDataSource<any>;
  totalData: any;
  constructor() { }
}
