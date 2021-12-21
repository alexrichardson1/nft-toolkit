import { ProgressActionI } from "actions/progressActions";
import { undefinedCheck } from "utils/typeUtils";

interface ProgressStateI {
  inProgress: boolean;
  progressAmount: number;
}

const stopProgress = (state: ProgressStateI): ProgressStateI => {
  return { ...state, progressAmount: 0, inProgress: false };
};

const finishProgress = (state: ProgressStateI): ProgressStateI => {
  return { ...state, progressAmount: 100 };
};

const advanceProgressBy = (
  state: ProgressStateI,
  action: ProgressActionI
): ProgressStateI => {
  const MAX_LOADING_VALUE = 99;
  return {
    ...state,
    progressAmount: action.payload.advanceProgressBy
      ? Math.min(
          state.progressAmount + action.payload.advanceProgressBy,
          MAX_LOADING_VALUE
        )
      : MAX_LOADING_VALUE,
  };
};

const startProgress = (state: ProgressStateI): ProgressStateI => {
  return { ...state, progressAmount: 0, inProgress: true };
};

const progressReducer = (
  state: ProgressStateI = {
    inProgress: false,
    progressAmount: 0,
  },
  action: ProgressActionI
): ProgressStateI => {
  const reducers = [
    startProgress,
    advanceProgressBy,
    finishProgress,
    stopProgress,
  ];
  const reducer = undefinedCheck(
    reducers[action.type],
    "Invalid action provided"
  );
  return reducer(state, action);
};

export default progressReducer;
