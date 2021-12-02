import FormActions from "actions/formActions";
import { FormActionI } from "reducers/formReducerTypes";
import { inputDispatch } from "./FormHandles";

export const handlePredictionsChange = (
  newPredictions: MlDataI,
  dispatch: React.Dispatch<FormActionI>
): void => {
  dispatch({
    type: FormActions.CHANGE_PREDICTIONS,
    payload: { newPredictions },
  });
};

export const handleTwitterChange = (
  e: InputEventT,
  dispatch: React.Dispatch<FormActionI>
): void => {
  inputDispatch(
    e,
    dispatch,
    FormActions.CHANGE_TWITTER_HANDLE,
    "twitterHandleChange"
  );
};

export const handleRedditChange = (
  e: InputEventT,
  dispatch: React.Dispatch<FormActionI>
): void => {
  inputDispatch(
    e,
    dispatch,
    FormActions.CHANGE_REDDIT_HANDLE,
    "redditHandleChange"
  );
};
