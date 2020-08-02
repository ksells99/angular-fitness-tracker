import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class UIService {
  constructor(private snackBar: MatSnackBar) {}
  // // Event listener for when loading changes
  // loadingStateChanged = new Subject<boolean>();

  //   Show snackbar for error messages - hide after 3sec
  showSnackbar(message, action) {
    this.snackBar.open(message, action, {
      duration: 3000,
      verticalPosition: 'top',
    });
  }
}
