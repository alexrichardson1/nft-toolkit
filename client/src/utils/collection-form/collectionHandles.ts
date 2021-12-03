import FormActions from "actions/formActions";
import { FormActionI } from "reducers/formReducerTypes";
import { inputDispatch } from "./formHandles";

export const handleCollNameChange = (dispatch: React.Dispatch<FormActionI>) => {
  return (e: InputEventT): void => {
    inputDispatch(e, dispatch, FormActions.CHANGE_NAME, "newName");
  };
};

export const handleMintPriceChange = (
  dispatch: React.Dispatch<FormActionI>
) => {
  return (e: InputEventT): void => {
    inputDispatch(e, dispatch, FormActions.CHANGE_PRICE, "price");
  };
};

export const handleSymbolChange = (dispatch: React.Dispatch<FormActionI>) => {
  return (e: InputEventT): void => {
    inputDispatch(e, dispatch, FormActions.CHANGE_SYMBOL, "symbol");
  };
};

export const handleDescriptionChange = (
  dispatch: React.Dispatch<FormActionI>
) => {
  return (e: InputEventT): void => {
    inputDispatch(e, dispatch, FormActions.CHANGE_DESCRIPTION, "description");
  };
};
