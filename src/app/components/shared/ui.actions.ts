import { Action } from '@ngrx/store';

export const SET_LOADING = '[UI] Set Loading';
export const STOP_LOADING = '[UI] Stop Loading';

export class SetLoading implements Action {
  readonly type = SET_LOADING;
}

export class StopLoading implements Action {
  readonly type = STOP_LOADING;
}

export type UIActions = SetLoading | StopLoading;
