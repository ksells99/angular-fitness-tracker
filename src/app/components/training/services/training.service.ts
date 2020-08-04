import { Exercise } from '../models/Exercise';

import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

import { AngularFireAuth } from 'angularfire2/auth';
import { UIService } from '../../shared/ui.service';
import * as UI from '../../shared/ui.actions';
import * as Training from '../../training/training.actions';
import * as fromRoot from '../../../app.reducer';
import { Store } from '@ngrx/store';

@Injectable()
export class TrainingService {
  private firebaseSubs: Subscription[] = [];

  constructor(
    private db: AngularFirestore,
    private afAuth: AngularFireAuth,
    private uiService: UIService,
    private store: Store<fromRoot.State>
  ) {}

  // Get training types from availableExercise collection from Firestore
  getAvailableExercises() {
    this.store.dispatch(new UI.SetLoading());
    return this.firebaseSubs.push(
      this.db
        .collection('availableExercises')
        .snapshotChanges()
        // Map through each one and create object with ID, name, duration etc.
        .pipe(
          map((docArray) => {
            return docArray.map((doc) => {
              return {
                id: doc.payload.doc.id,
                ...(doc.payload.doc.data() as Exercise),
              };
            });
          })
        )
        .subscribe(
          (exercises: Exercise[]) => {
            // Set loading to false
            this.store.dispatch(new UI.StopLoading());

            // Dispatch setAvailableTypes and send result (exercise types) as payload
            this.store.dispatch(new Training.SetAvailableTypes(exercises));
          },
          (error) => {
            // If loading exercises fails, pass false into loadingState - in turn picked up by component to stop spinner
            this.store.dispatch(new UI.StopLoading());

            this.uiService.showSnackbar(
              'Loading of available excerise types failed. Please try again later.',
              null
            );
          }
        )
    );
  }

  //   Called from new-training component - ID of selected type passed in
  startExercise(selectedId: string) {
    // Dispatch action - pass in ID of selected training type as payload
    this.store.dispatch(new Training.StartTraining(selectedId));
  }

  completeExercise() {
    // Get the current active training from NGRX store - subscribe - exercise returned as a result
    this.store
      .select(fromRoot.getActiveTraining)
      .pipe(take(1))
      .subscribe((exercise) => {
        //   Call addtoDB function, pass in current exercise obtained from store above - also add current date and completed status
        this.addDataToDB({
          ...exercise,
          date: new Date(),
          state: 'completed',
        });

        // Dispatch action
        this.store.dispatch(new Training.StopTraining());
      });
  }

  cancelExercise(progress: number) {
    // Get the current active training from NGRX store - subscribe - exercise returned as a result
    this.store
      .select(fromRoot.getActiveTraining)
      .pipe(take(1))
      .subscribe((exercise) => {
        //   Call addtoDB function, pass in current exercise obtained from store above - also add current date and cancelled status, plus the actual calories/duration
        this.addDataToDB({
          ...exercise,
          // Calculate duration & calories based on actual time spent
          duration: exercise.duration * (progress / 100),
          calories: exercise.calories * (progress / 100),
          date: new Date(),
          state: 'cancelled',
        });

        // Dispatch action
        this.store.dispatch(new Training.StopTraining());
      });
  }

  getExerciseHistory() {
    const loggedInUserId = this.afAuth.auth.currentUser.uid;
    console.log(loggedInUserId);
    // Get data from savedExercies collection from Firebase - subscribe, returns the list
    this.firebaseSubs.push(
      // Get only those belonging to the logged in user
      this.db
        .collection('savedExercises', (ref) =>
          ref.where('userId', '==', loggedInUserId)
        )

        .valueChanges()
        .subscribe((data: Exercise[]) => {
          // Dispatch action - pass in history data from FB as payload
          this.store.dispatch(new Training.SetFinishedTrainings(data));
        })
    );
  }

  // Add exercise (complete or cancelled) to Firebase
  private addDataToDB(exercise: Exercise) {
    const loggedInUserId = this.afAuth.auth.currentUser.uid;
    exercise = { ...exercise, userId: loggedInUserId };
    // Add to collection - pass in exercise
    this.db.collection('savedExercises').add(exercise);
    // Show success message
    this.uiService.showSnackbar('Workout saved to your collection.', null);
  }

  cancelSubscriptions() {
    this.firebaseSubs.forEach((subscription) => subscription.unsubscribe());
  }
}
