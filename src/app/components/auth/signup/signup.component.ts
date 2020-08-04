import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../services/auth.service';

import { Observable } from 'rxjs';

import * as fromRoot from '../../../app.reducer';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  maxDate;

  isLoading$: Observable<boolean>;

  // Inject service & NGRX store as dependency
  constructor(
    private authService: AuthService,

    private store: Store<fromRoot.State>
  ) {}

  ngOnInit() {
    // Get isLoading status from NGRX store
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);

    // Get today's date
    this.maxDate = new Date();
    // Get year and subtract 18 - used for 18+ registration
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  onSubmit(form: NgForm) {
    // When sign up form submitted, call registerUser function on service, pass in email/PW
    this.authService.registerUser({
      email: form.value.email,
      password: form.value.password,
    });
  }
}
