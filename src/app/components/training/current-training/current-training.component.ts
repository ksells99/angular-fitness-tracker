import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { StopTrainingComponent } from './stop-training/stop-training.component';
import { TrainingService } from '../services/training.service';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../app.reducer';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.css'],
})
export class CurrentTrainingComponent implements OnInit {
  progress = 0;
  timer: number;

  // Inject material dialog & training service, & NGRX store as dependencies
  constructor(
    private dialog: MatDialog,
    private trainingService: TrainingService,
    private store: Store<fromRoot.State>
  ) {}

  ngOnInit() {
    this.startOrResumeTimer();
  }

  startOrResumeTimer() {
    // Get active training from NGRX store, subscribe to result - returns running exercise
    this.store
      .select(fromRoot.getActiveTraining)
      .pipe(take(1))
      .subscribe((exercise) => {
        // Get duration of running exercise,divide by 100, then times by 1000
        const step = (exercise.duration / 100) * 1000;

        // Progress timer - interval = step calculated above
        this.timer = setInterval(() => {
          this.progress = this.progress + 1;
          // Stop progress timer when at 100%
          if (this.progress >= 100) {
            // Call completeEx function on service
            this.trainingService.completeExercise();

            clearInterval(this.timer);
          }
        }, step) as any;
      });
  }

  // Stop button - stop progress timer
  onStop() {
    clearInterval(this.timer);
    // Open dialog (stop component) - pass in current progress
    const dialogRef = this.dialog.open(StopTrainingComponent, {
      data: {
        progress: this.progress,
      },
    });

    // When dialog closed - subscribe to observable and pick up result (yes/true or no/false)
    dialogRef.afterClosed().subscribe((result) => {
      // If true (ie. user clicked yes)
      if (result) {
        // Call cancelEx function on service, pass in progress
        this.trainingService.cancelExercise(this.progress);
        // Else if user clicked no, resume timer from current progress level
      } else {
        this.startOrResumeTimer();
      }
    });
  }
}
