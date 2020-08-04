import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';
import * as fromRoot from '../../app.reducer';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.css'],
})
export class TrainingComponent implements OnInit {
  ongoingTraining$: Observable<boolean>;

  // Inject NGRX store
  constructor(private store: Store<fromRoot.State>) {}

  ngOnInit() {
    // Get isTraining status from store
    this.ongoingTraining$ = this.store.select(fromRoot.getIsTraining);
  }
}
