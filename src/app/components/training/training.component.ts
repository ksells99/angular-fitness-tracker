import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { TrainingService } from './services/training.service';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../app.reducer';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.css'],
})
export class TrainingComponent implements OnInit {
  ongoingTraining$: Observable<boolean>;

  // exerciseSubscription: Subscription;

  // Inject service & NGRX store
  constructor(
    private trainingService: TrainingService,
    private store: Store<fromRoot.State>
  ) {}

  ngOnInit() {
    // Get isTraining status from store
    this.ongoingTraining$ = this.store.select(fromRoot.getIsTraining);

    // // Subscribe to exerciseChanged property from service - selected exercise is then returned
    // this.exerciseSubscription = this.trainingService.exerciseChanged.subscribe(
    //   (exercise) => {
    //     // If user did select one, set ongoing to true
    //     if (exercise) {
    //       this.ongoingTraining = true;
    //       // Else if nothing selected, set as false
    //     } else {
    //       this.ongoingTraining = false;
    //     }
    //   }
    // );
  }

  // ngOnDestroy() {
  //   if (this.exerciseSubscription) {
  //     this.exerciseSubscription.unsubscribe();
  //   }
  // }
}
