import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import {UserInterface} from '../../../../_rms/interfaces/user/user.interface';
import {States} from '../../../../_rms/states/states';

@Component({
  selector: 'app-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.scss']
})
export class ProfileCardComponent {
  user$: Observable<UserInterface>;
  constructor(
      public states: States
  ) {
    this.user$ = this.states.currentUser.asObservable();
  }
}
