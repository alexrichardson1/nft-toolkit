import { ProgressActionI, ProgressActions } from "actions/progressActions";

interface ProgressStateI {
  inProgress: boolean;
  progressAmount: number;
}

const progressReducer = (
  state = {
    inProgress: false,
    progressAmount: 0,
  },
  action: ProgressActionI
): ProgressStateI => {
  const MAX_LOADING_VALUE = 99;
  switch (action.type) {
    case ProgressActions.START_PROGRESS:
      return { ...state, progressAmount: 0, inProgress: true };
    case ProgressActions.ADVANCE_PROGRESS_BY:
      return {
        ...state,
        progressAmount: action.payload.advanceProgressBy
          ? Math.min(
              state.progressAmount + action.payload.advanceProgressBy,
              MAX_LOADING_VALUE
            )
          : MAX_LOADING_VALUE,
      };
    case ProgressActions.FINISH_PROGRESS:
      return { ...state, progressAmount: 100 };
    case ProgressActions.STOP_PROGRESS:
      return { ...state, progressAmount: 0, inProgress: false };
    default:
      return state;
  }
};

export default progressReducer;
