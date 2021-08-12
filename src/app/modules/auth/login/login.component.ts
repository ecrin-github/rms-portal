import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import {AuthService} from '../../../_rms/services/auth/auth.service';
import {UserInterface} from '../../../_rms/interfaces/user/user.interface';
import {States} from '../../../_rms/states/states';
import {StatesService} from '../../../_rms/services/states/states.service';
import {PrivilegesService} from '../../../_rms/services/privileges/privileges.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  internalAuth: any = {
    email: 'sergei.gorianin@ecrin.org',
    password: 'admin',
  };
  externalAuth: any = {
    email: 'username@mail.org',
    password: 'username',
  };
  loginForm: FormGroup;
  hasError: boolean;
  returnUrl: string;
  isLoading$: Observable<boolean>;

  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private states: States,
    private statesService: StatesService,
    private privilegesService: PrivilegesService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.isLoading$ = this.authService.isLoading$;
    // redirect to home if already logged in
    if (this.statesService.currentUser) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    // get return url from route parameters or default to '/'
    this.returnUrl =
        this.route.snapshot.queryParams['returnUrl'.toString()] || '/';
    }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  loginExternal() {
    this.hasError = false;
    const loginSubscr = this.authService
      .login(this.externalAuth.email, this.externalAuth.password)
      .pipe(first())
      .subscribe((user: UserInterface) => {
        if (user) {
          this.router.navigate([this.returnUrl]);
        } else {
          this.hasError = true;
        }
      });
    this.unsubscribe.push(loginSubscr);
  }

  loginInternal() {
    this.hasError = false;
    const loginSubscr = this.authService
        .login(this.internalAuth.email, this.internalAuth.password)
        .pipe(first())
        .subscribe((user: UserInterface) => {
          if (user) {
            this.router.navigate([this.returnUrl]);
          } else {
            this.hasError = true;
          }
        });
    this.unsubscribe.push(loginSubscr);

  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
