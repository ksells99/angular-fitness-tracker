import {
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
} from '@ngrx/store';
import * as fromUi from './components/shared/ui.reducer';
import * as fromAuth from './components/auth/auth.reducer';
import * as fromTraining from './components/training/training.reducer';

// App-wide state - includes all state from other reducers
export interface State {
  ui: fromUi.State;
  auth: fromAuth.State;
  training: fromTraining.State;
}

// Group together all reducers
export const reducers: ActionReducerMap<State> = {
  ui: fromUi.uiReducer,
  auth: fromAuth.authReducer,
  training: fromTraining.trainingReducer,
};

// Target UI/auth areas of store
export const getUiState = createFeatureSelector<fromUi.State>('ui');
export const getAuthState = createFeatureSelector<fromAuth.State>('auth');
export const getTrainingState = createFeatureSelector<fromTraining.State>(
  'training'
);

// Pick up getUiState from above, then the getIsLoading property
export const getIsLoading = createSelector(getUiState, fromUi.getIsLoading);

// Repeat for others
export const getIsAuthenticated = createSelector(
  getAuthState,
  fromAuth.getIsAuthenticated
);

export const getTrainingTypes = createSelector(
  getTrainingState,
  fromTraining.getTrainingTypes
);
export const getFinishedExercises = createSelector(
  getTrainingState,
  fromTraining.getFinishedExercises
);
export const getActiveTraining = createSelector(
  getTrainingState,
  fromTraining.getActiveTraining
);
export const getIsTraining = createSelector(
  getTrainingState,
  fromTraining.getIsTraining
);
