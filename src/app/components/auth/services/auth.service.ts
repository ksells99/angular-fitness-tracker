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
  // // Subject for when auth status changes - picked up by navbar/sidebar to change links
  // authChange = new Subject<boolean>();

  // private isAuthenticated: boolean = false;

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
        // // Set isAuthenticated to true
        // this.isAuthenticated = true;
        // // Send true to subject above
        // this.authChange.next(true);

        // Dispatch action to set authenticated to true
        this.store.dispatch(new Auth.SetAuthenticated());

        // Redirect to training page
        this.router.navigate(['/training']);
      } else {
        this.trainingService.cancelSubscriptions();
        // Dispatch action to set authenticated to false
        this.store.dispatch(new Auth.SetUnauthenticated());

        // // Send false to subject above - picked up by nav bars
        // this.authChange.next(false);

        // // Redirect to welcome page
        this.router.navigate(['/']);

        // this.isAuthenticated = false;
      }
    });
  }

  registerUser(authData: AuthData) {
    // // Set loading to true in UI service when login is called
    // this.uiService.loadingStateChanged.next(true);

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
    // // Set loading to true in UI service when login is called
    // this.uiService.loadingStateChanged.next(true);

    this.store.dispatch(new UI.SetLoading());

    // Call sign in function on FB - pass in email/PW
    this.afAuth.auth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .then((result) => {
        // Set loading to false
        // this.uiService.loadingStateChanged.next(false);
        this.store.dispatch(new UI.StopLoading());
      })
      .catch((error) => {
        // this.uiService.loadingStateChanged.next(false);
        this.store.dispatch(new UI.StopLoading());
        // Call function on UI service to show snackbar error - null=no action req'd
        this.uiService.showSnackbar(error.message, null);
      });
  }

  logout() {
    // Sign user out from FB - also invalidates token
    this.afAuth.auth.signOut();
  }

  // isAuth() {
  //   //   Returns true if user is authenticated
  //   return this.isAuthenticated;
  // }
}
