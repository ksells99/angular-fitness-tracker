import { Component, OnInit } from '@angular/core';
import { TrainingService } from '../services/training.service';
import { Exercise } from '../models/Exercise';
import { NgForm } from '@angular/forms';
import * as fromRoot from '../../../app.reducer';
import { Store } from '@ngrx/store';

import { Observable } from 'rxjs';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css'],
})
export class NewTrainingComponent implements OnInit {
  trainingTypes$: Observable<Exercise[]>;
  isLoading$: Observable<boolean>;
  // private exerciseSubscription: Subscription;

  // Inject service & NGRX store
  constructor(
    private trainingService: TrainingService,
    private store: Store<fromRoot.State>
  ) {}

  ngOnInit() {
    // Get loading state & training types from NGRX store
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    this.trainingTypes$ = this.store.select(fromRoot.getTrainingTypes);

    // this.exerciseSubscription = this.trainingService.exercisesChanged.subscribe(
    //   (exercises) => {
    //     this.trainingTypes = exercises;
    //     // // Set loading to false once exercises obtained
    //     // this.isLoading = false;
    //   }
    // );

    this.fetchExercises();
  }
  // When new training started - form data is passed in, then pass exercise to start function on service
  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }

  fetchExercises() {
    this.trainingService.getAvailableExercises();
  }

  // ngOnDestroy() {
  //   // Unsubscribe from obs. when page destroyed
  //   if (this.exerciseSubscription) {
  //     this.exerciseSubscription.unsubscribe();
  //   }
  // }
}
