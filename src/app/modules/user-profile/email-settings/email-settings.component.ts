import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { AuthService, UserModel } from '../../auth';

@Component({
  selector: 'app-email-settings',
  templateUrl: './email-settings.component.html',
  styleUrls: ['./email-settings.component.scss']
})
export class EmailSettingsComponent implements OnInit, OnDestroy {
  formGroup: FormGroup;
  user: UserModel;
  firstUserState: UserModel;
  subscriptions: Subscription[] = [];
  isLoading$: Observable<boolean>;

  constructor(private userService: AuthService, private fb: FormBuilder) {
    this.isLoading$ = this.userService.isLoadingSubject.asObservable();
  }

  ngOnInit(): void {
    const sb = this.userService.currentUserSubject.asObservable().pipe(
      first(user => !!user)
    ).subscribe(user => {
      this.user = Object.assign({}, user);
      this.firstUserState = Object.assign({}, user);
      this.loadForm();
    });
    this.subscriptions.push(sb);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  loadForm() {
    this.formGroup = this.fb.group({
      emailNotification: [this.user.emailSettings.emailNotification],
      sendCopyToPersonalEmail: [this.user.emailSettings.sendCopyToPersonalEmail],
      youHaveNewNotifications: [this.user.emailSettings.activityRelatesEmail.youHaveNewNotifications],
      organizationActivity: [this.user.emailSettings.activityRelatesEmail.youHaveNewNotifications],

    });
  }

  save() {
    this.formGroup.markAllAsTouched();
    if (!this.formGroup.valid) {
      return;
    }

    const formValues = this.formGroup.value;
    this.user = Object.assign(this.user, {
      emailSettings: {
        emailNotification: formValues.emailNotification,
        sendCopyToPersonalEmail: formValues.sendCopyToPersonalEmail,
        activityRelatesEmail: {
          youHaveNewNotifications: formValues.youHaveNewNotifications,
          organizationActivity: formValues.organizationActivity
        }
      }
    });

    // Do request to your server for user update, we just imitate user update there
    this.userService.isLoadingSubject.next(true);
    setTimeout(() => {
      this.userService.currentUserSubject.next(Object.assign({}, this.user));
      this.userService.isLoadingSubject.next(false);
    }, 2000);
  }

  cancel() {
    this.user = Object.assign({}, this.firstUserState);
    this.loadForm();
  }
}
