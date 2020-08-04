import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { UIService } from '../../shared/ui.service';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../app.reducer';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  isLoading$: Observable<boolean>;

  // Inject services & NGRX store as dependencies
  constructor(
    private authService: AuthService,
    private uiService: UIService,
    private store: Store<{ ui: fromRoot.State }>
  ) {}

  ngOnInit() {
    // Get isLoading value from NGRX store (subscription handled via async pipe in HTML)
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);

    this.loginForm = new FormGroup({
      // Form validation for email & password - initial values blank for both fields
      email: new FormControl('', {
        // Required and must be email format
        validators: [Validators.required, Validators.email],
      }),
      // Required
      password: new FormControl('', { validators: [Validators.required] }),
    });
  }

  onSubmit() {
    // When login form submitted, call login function on service, pass in email/PW from form
    this.authService.login({
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    });
  }
}
