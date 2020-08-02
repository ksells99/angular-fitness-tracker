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
  // // Subject for when an exercise is selected
  // exerciseChanged = new Subject<Exercise>();

  // exercisesChanged = new Subject<Exercise[]>();
  // finishedExercisesChanged = new Subject<Exercise[]>();

  // // Array of exercise types
  // private availableExercises: Exercise[] = [];

  // private runningExercise: Exercise;

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

            // // Subscribe to obs. and set these as available exercises
            // this.availableExercises = exercises;
            // // Emit copy of array to be picked up by new-training component
            // this.exercisesChanged.next([...this.availableExercises]);
          },
          (error) => {
            // If loading exercises fails, pass false into loadingState - in turn picked up by component to stop spinner
            this.store.dispatch(new UI.StopLoading());

            this.uiService.showSnackbar(
              'Loading of available excerise types failed. Please try again later.',
              null
            );
            // this.exercisesChanged.next(null);
          }
        )
    );
  }

  //   Called from new-training component - ID of selected type passed in
  startExercise(selectedId: string) {
    // //   Map through above array and find the type the user selected - set as runningExcerise
    // this.runningExercise = this.availableExercises.find(
    //   (exercise) => exercise.id == selectedId
    // );
    // // Send copy of runningExercise to subject above - in turn picked up by training component
    // this.exerciseChanged.next({ ...this.runningExercise });

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

    // //   Set running and changed to null - ie. stop anything running
    // this.runningExercise = null;
    // this.exerciseChanged.next(null);
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

    // //   Set running and changed to null - ie. stop anything running
    // this.runningExercise = null;
    // this.exerciseChanged.next(null);
  }

  // getRunningExercise() {
  //   //   Return copy of runningExercise
  //   return { ...this.runningExercise };
  // }

  getExerciseHistory() {
    const loggedInUserId = this.afAuth.auth.currentUser.uid;
    console.log(loggedInUserId);
    // Get data from savedExercies collection from Firebase - subscribe, returns the list
    this.firebaseSubs.push(
      this.db
        .collection('savedExercises', (ref) =>
          ref.where('userId', '==', loggedInUserId)
        )

        .valueChanges()
        .subscribe((data: Exercise[]) => {
          // // Emit data to subject
          // this.finishedExercisesChanged.next(data);

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
