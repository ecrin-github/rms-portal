import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../../../../../../_rms';
import { Observable } from 'rxjs';
import {UserInterface} from '../../../../../interfaces/user/user.interface';
import {States} from '../../../../../states/states';
import {AuthService} from '../../../../../services/auth/auth.service';
import { UserService } from 'src/app/_rms/services/user/user.service';
import { OidcSecurityService } from 'angular-auth-oidc-client';
export interface UserDataResult {
  sub: string,
  name: string
  preferred_username: string,
  given_name: string,
  family_name: string,
  email: string
  pic: string
  occupation: string
}


@Component({
  selector: 'app-user-offcanvas',
  templateUrl: './user-offcanvas.component.html',
  styleUrls: ['./user-offcanvas.component.scss'],
})
export class UserOffcanvasComponent implements OnInit {
  extrasUserOffcanvasDirection = 'offcanvas-right';
  user$: Observable<UserInterface>;
  userData: any;

  constructor(
      private layout: LayoutService,
      private states: States,
      private auth: AuthService,
      private userService: UserService,
      private OidcSecurityService: OidcSecurityService
  ) {}

  ngOnInit(): void {
    this.extrasUserOffcanvasDirection = `offcanvas-${this.layout.getProp(
      'extras.user.offcanvas.direction'
    )}`;
    this.user$ = this.states.currentUser.asObservable();
    this.getUserData();
  }
  getUserData() {
    this.userService.getUser().subscribe((res: any) => {
      if (res) {
        this.userData = res;
        this.userData.pic = './assets/media/svg/avatars/001-boy.svg';
        this.userData.occupation = '';
      }
      // Elixir AAI
      // if (res.data && res.data.length) {
      //   this.userData = res.data[0];
      //   this.userData.pic = './assets/media/svg/avatars/001-boy.svg';
      //   this.userData.occupation = '';
      // }
    }, error => {
      console.log('error', error);
    })
  }

  logout() {
    this.OidcSecurityService.logoff();
    // this.auth.logout();
    // document.location.reload();
  }
}
