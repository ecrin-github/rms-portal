import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-organization-members',
  templateUrl: './organization-members.component.html',
})
export class OrganizationMembersComponent {
  @Input() cssClass;

  constructor() {}

}
