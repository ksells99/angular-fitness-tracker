import { Action } from '@ngrx/store';
import {} from './training.actions';
import { Exercise } from './models/Exercise';
import {
  TrainingActions,
  SET_TRAINING_TYPES,
  SET_FINISHED_TRAININGS,
  START_TRAINING,
  STOP_TRAINING,
} from '../training/training.actions';

export interface State {
  availableExercises: Exercise[];
  finishedExercises: Exercise[];
  activeTraining: Exercise;
}

const initialState: State = {
  availableExercises: [],
  finishedExercises: [],
  activeTraining: null,
};

export function trainingReducer(state = initialState, action: TrainingActions) {
  switch (action.type) {
    case SET_TRAINING_TYPES:
      return {
        //   Return current state plus available types
        ...state,
        availableExercises: action.payload,
      };
    case SET_FINISHED_TRAININGS:
      return {
        ...state,
        finishedExercises: action.payload,
      };
    case START_TRAINING:
      return {
        ...state,
        // Find training type based on ID passed from action - set this to the active training
        activeTraining: {
          ...state.availableExercises.find((ex) => ex.id === action.payload),
        },
      };
    case STOP_TRAINING:
      return {
        ...state,
        activeTraining: null,
      };
    default: {
      return state;
    }
  }
}

// Helper functions

export const getTrainingTypes = (state: State) => state.availableExercises;
export const getFinishedExercises = (state: State) => state.finishedExercises;
export const getActiveTraining = (state: State) => state.activeTraining;
// If there is an active training, will return true
export const getIsTraining = (state: State) => state.activeTraining !== null;
