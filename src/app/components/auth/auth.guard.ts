import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../app.reducer';

@Injectable()
export class AuthGuard implements CanActivate {
  // Inject NGRX store as dependency - can then pick up from state if user is authenticated
  constructor(private store: Store<fromRoot.State>) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // // Return true if user is authenticated - call isAuth function on service
    // if (this.authService.isAuth()) {
    //   return true;
    //   //   Else if not authenticated, redirect to login
    // } else {
    //   this.router.navigate(['/login']);
    // }

    // Get auth status from store - returns true if user is authenticated
    return this.store.select(fromRoot.getIsAuthenticated);
  }
}
