import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Exercise } from '../models/Exercise';
import { MatTableDataSource } from '@angular/material/table';
import { TrainingService } from '../services/training.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

import { Store } from '@ngrx/store';
import * as fromRoot from '../../../app.reducer';

@Component({
  selector: 'app-training-history',
  templateUrl: './training-history.component.html',
  styleUrls: ['./training-history.component.css'],
})
export class TrainingHistoryComponent implements OnInit, AfterViewInit {
  displayedColumns = ['date', 'name', 'calories', 'duration', 'state'];
  dataSource = new MatTableDataSource<Exercise>();

  // Get MatSort from HTML template - store in sort variable
  @ViewChild(MatSort) sort: MatSort;

  // Get paginator data from template
  @ViewChild(MatPaginator) paginator: MatPaginator;

  // Inject training service & NGRX store as dependencies
  constructor(
    private trainingService: TrainingService,
    private store: Store<fromRoot.State>
  ) {}

  ngOnInit() {
    // Get training history from NGRX store & pass into dataSource to populate table
    this.store
      .select(fromRoot.getFinishedExercises)
      .subscribe((exercises: Exercise[]) => (this.dataSource.data = exercises));

    // Call function on service to trigger history to be obtained from FB
    this.trainingService.getExerciseHistory();
  }

  // Executed once component/template finishes rendering
  ngAfterViewInit() {
    // Set sort/paginator variables above to dataSource - can then be picked up by table
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  // Called when user types into filter input - takes in search value and sets to dataSource property
  filter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
