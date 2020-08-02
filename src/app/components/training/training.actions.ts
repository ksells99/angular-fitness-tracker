import { Action } from '@ngrx/store';
import { Exercise } from './models/Exercise';

export const SET_TRAINING_TYPES = '[TRAINING] Set Training Types';
export const SET_FINISHED_TRAININGS = '[TRAINING] Set Finished Trainings';
export const START_TRAINING = '[TRAINING] Start Training';
export const STOP_TRAINING = '[TRAINING] Stop Training';

export class SetAvailableTypes implements Action {
  readonly type = SET_TRAINING_TYPES;

  //   Payload = array of exercises
  constructor(public payload: Exercise[]) {}
}

export class SetFinishedTrainings implements Action {
  readonly type = SET_FINISHED_TRAININGS;

  constructor(public payload: Exercise[]) {}
}

export class StartTraining implements Action {
  readonly type = START_TRAINING;

  // Payload = selected type ID
  constructor(public payload: string) {}
}

export class StopTraining implements Action {
  readonly type = STOP_TRAINING;
}

export type TrainingActions =
  | SetAvailableTypes
  | SetFinishedTrainings
  | StartTraining
  | StopTraining;
