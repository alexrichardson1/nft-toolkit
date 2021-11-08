export enum ProgressActions {
  START_PROGRESS,
  ADVANCE_PROGRESS_BY,
  FINISH_PROGRESS,
  STOP_PROGRESS,
}

export interface ProgressActionI {
  type: ProgressActions;
  payload: { advanceProgressBy?: number };
}
