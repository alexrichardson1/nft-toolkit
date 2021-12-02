import FormActions from "actions/formActions";
import { FormActionI } from "reducers/formReducerTypes";
import { inputDispatch } from "./FormHandles";

export const handleCollNameChange = (
  e: InputEventT,
  dispatch: React.Dispatch<FormActionI>
): void => {
  inputDispatch(e, dispatch, FormActions.CHANGE_NAME, "newName");
};

export const handleMintPriceChange = (
  e: InputEventT,
  dispatch: React.Dispatch<FormActionI>
): void => {
  inputDispatch(e, dispatch, FormActions.CHANGE_PRICE, "price");
};

export const handleSymbolChange = (
  e: InputEventT,
  dispatch: React.Dispatch<FormActionI>
): void => {
  inputDispatch(e, dispatch, FormActions.CHANGE_SYMBOL, "symbol");
};

export const handleDescriptionChange = (
  e: InputEventT,
  dispatch: React.Dispatch<FormActionI>
): void => {
  inputDispatch(e, dispatch, FormActions.CHANGE_DESCRIPTION, "description");
};
