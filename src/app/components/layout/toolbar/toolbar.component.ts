import { Component, OnInit, EventEmitter, Output } from '@angular/core';

import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../app.reducer';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css'],
})
export class ToolbarComponent implements OnInit {
  // Listenable event
  @Output() sidenavToggle = new EventEmitter<void>();

  isAuth$: Observable<boolean>;

  // Import NGRX store & auth service as dependencies
  constructor(
    private store: Store<fromRoot.State>,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Get authentication status from store
    this.isAuth$ = this.store.select(fromRoot.getIsAuthenticated);
  }

  // Used when hamburger button clicked - emit sidenavToggle output above - then picked up by main app.component.html
  toggleSidenav() {
    this.sidenavToggle.emit();
  }

  // When logout button clicked on toolbar - call logout function on service
  onLogout() {
    this.authService.logout();
  }
}
