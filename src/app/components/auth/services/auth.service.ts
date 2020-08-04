import { AuthData } from '../models/AuthData';

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { TrainingService } from '../../training/services/training.service';

import { UIService } from '../../shared/ui.service';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../app.reducer';
import * as UI from '../../shared/ui.actions';
import * as Auth from '../../auth/auth.actions';

// Need @Injectable in order to import another service into this service
@Injectable()
export class AuthService {
  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private trainingService: TrainingService,
    private uiService: UIService,

    // NGRX store - with type of state from app.reducer
    private store: Store<{ ui: fromRoot.State }>
  ) {}

  // Called when app starts in app-component.ts
  initAuthListener() {
    this.afAuth.authState.subscribe((user) => {
      // If authenticated...
      if (user) {
        // Dispatch action to set authenticated to true
        this.store.dispatch(new Auth.SetAuthenticated());

        // Redirect to training page
        this.router.navigate(['/training']);
      } else {
        this.trainingService.cancelSubscriptions();
        // Dispatch action to set authenticated to false
        this.store.dispatch(new Auth.SetUnauthenticated());

        // // Redirect to welcome page
        this.router.navigate(['/']);
      }
    });
  }

  registerUser(authData: AuthData) {
    // Dispatch to reducer to set loading to true
    this.store.dispatch(new UI.SetLoading());
    // Call create user function from FB - pass in email/PW
    this.afAuth.auth
      .createUserWithEmailAndPassword(authData.email, authData.password)
      .then((result) => {
        this.store.dispatch(new UI.StopLoading());
      })
      .catch((error) => {
        // this.uiService.loadingStateChanged.next(false);
        this.store.dispatch(new UI.StopLoading());
        // Call function on UI service to show snackbar error - null=no action req'd
        this.uiService.showSnackbar(error.message, null);
      });
  }

  login(authData: AuthData) {
    this.store.dispatch(new UI.SetLoading());

    // Call sign in function on FB - pass in email/PW
    this.afAuth.auth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .then((result) => {
        // Set loading to false

        this.store.dispatch(new UI.StopLoading());
      })
      .catch((error) => {
        this.store.dispatch(new UI.StopLoading());
        // Call function on UI service to show snackbar error - null=no action req'd
        this.uiService.showSnackbar(error.message, null);
      });
  }

  logout() {
    // Sign user out from FB - also invalidates token
    this.afAuth.auth.signOut();
  }
}
