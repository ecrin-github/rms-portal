import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import {StatesService} from '../../services/states/states.service';
import {AuthService} from '../../services/auth/auth.service';


@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
      private statesService: StatesService,
      private authService: AuthService,
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.statesService.currentUser) {

      return true;
    }

    this.authService.logout();
    return false;
  }
}
