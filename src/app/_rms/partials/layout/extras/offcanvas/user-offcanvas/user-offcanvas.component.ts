import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../../../../../../_rms';
import { Observable } from 'rxjs';
import {UserInterface} from '../../../../../interfaces/user/user.interface';
import {States} from '../../../../../states/states';
import {AuthService} from '../../../../../services/auth/auth.service';


@Component({
  selector: 'app-user-offcanvas',
  templateUrl: './user-offcanvas.component.html',
  styleUrls: ['./user-offcanvas.component.scss'],
})
export class UserOffcanvasComponent implements OnInit {
  extrasUserOffcanvasDirection = 'offcanvas-right';
  user$: Observable<UserInterface>;

  constructor(
      private layout: LayoutService,
      private states: States,
      private auth: AuthService,
  ) {}

  ngOnInit(): void {
    this.extrasUserOffcanvasDirection = `offcanvas-${this.layout.getProp(
      'extras.user.offcanvas.direction'
    )}`;
    this.user$ = this.states.currentUser.asObservable();
  }

  logout() {
    this.auth.logout();
    document.location.reload();
  }
}
