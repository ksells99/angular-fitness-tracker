import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { UIService } from '../../shared/ui.service';
import { Subscription, Observable } from 'rxjs';

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
  private loadingSubscription: Subscription;

  // Inject service & NGRX store as dependency
  constructor(
    private authService: AuthService,
    private uiService: UIService,
    private store: Store<fromRoot.State>
  ) {}

  ngOnInit() {
    // // Subscribe to loading emitter from UI service - will then toggle isLoading to true/false depending on result
    // this.loadingSubscription = this.uiService.loadingStateChanged.subscribe(
    //   (res) => (this.isLoading = res)
    // );

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

//   // Unsubscribe to loadingSubscription when page destroyed
//   ngOnDestroy() {
//     if (this.loadingSubscription) {
//       this.loadingSubscription.unsubscribe();
//     }
//   }
// }
