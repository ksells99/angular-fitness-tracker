import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';

import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
// Import root reducer
import * as fromRoot from '../../../app.reducer';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css'],
})
export class SidenavListComponent implements OnInit {
  // Event emitter for closing sidenav - picked up by app.comp.html
  @Output() closeSidenav = new EventEmitter<void>();

  isAuth$: Observable<boolean>;

  // Import authService & NGRX store as dependencies
  constructor(
    private authService: AuthService,
    private store: Store<fromRoot.State>
  ) {}

  ngOnInit() {
    // Get auth status from store
    this.isAuth$ = this.store.select(fromRoot.getIsAuthenticated);
  }

  onClose() {
    this.closeSidenav.emit();
  }

  // When logout button clicked on sidenav - call logout function on service
  onLogout() {
    this.authService.logout();
    // call onClose function above to close sidenav
    this.onClose();
  }
}
