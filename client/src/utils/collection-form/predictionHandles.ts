import FormActions from "actions/formActions";
import { FormActionI } from "reducers/formReducerTypes";
import { inputDispatch } from "./formHandles";

export const handlePredictionsChange = (
  newPredictions: MlDataI,
  dispatch: React.Dispatch<FormActionI>
): void => {
  return dispatch({
    type: FormActions.CHANGE_PREDICTIONS,
    payload: { newPredictions },
  });
};

export const handleTwitterChange = (dispatch: React.Dispatch<FormActionI>) => {
  return (e: InputEventT): void => {
    inputDispatch(
      e,
      dispatch,
      FormActions.CHANGE_TWITTER_HANDLE,
      "twitterHandleChange"
    );
  };
};

export const handleRedditChange = (dispatch: React.Dispatch<FormActionI>) => {
  return (e: InputEventT): void => {
    inputDispatch(
      e,
      dispatch,
      FormActions.CHANGE_REDDIT_HANDLE,
      "redditHandleChange"
    );
  };
};
