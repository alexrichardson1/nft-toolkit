import FormActions from "actions/formActions";
import { FormActionI } from "reducers/formReducerTypes";
import { inputDispatch } from "./formHandles";

export const handleMplaceRoyaltyChange = (
  dispatch: React.Dispatch<FormActionI>
) => {
  return (e: InputEventT): void => {
    inputDispatch(
      e,
      dispatch,
      FormActions.CHANGE_ROYALTY,
      "mplaceRoyaltyChange"
    );
  };
};

export const handleMplaceWantedChange = (
  dispatch: React.Dispatch<FormActionI>
) => {
  return (e: React.ChangeEvent<HTMLInputElement>): void => {
    dispatch({
      type: FormActions.CHANGE_WANTED,
      payload: { mplaceWantedChange: e.target.checked },
    });
  };
};

export const handleMplaceAllMintChange = (
  dispatch: React.Dispatch<FormActionI>
) => {
  return (e: React.ChangeEvent<HTMLInputElement>): void => {
    dispatch({
      type: FormActions.CHANGE_ALL_MINT,
      payload: { mplaceAllMintChange: e.target.checked },
    });
  };
};
