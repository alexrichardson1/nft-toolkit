import { DragEndEvent } from "@dnd-kit/core";
import FormActions from "actions/formActions";
import { FormActionI } from "reducers/formReducerTypes";
import { inputDispatch } from "./FormHandles";

export const handleLayerAddition = (
  newLayerName: string,
  dispatch: React.Dispatch<FormActionI>
): void => {
  dispatch({
    type: FormActions.ADD_LAYER,
    payload: { newLayer: { name: newLayerName } },
  });
};

export const handleLayerRemoval = (
  layerName: string,
  dispatch: React.Dispatch<FormActionI>
): void => {
  dispatch({
    type: FormActions.REMOVE_LAYER,
    payload: { deleteLayerName: layerName },
  });
};

export const handleImgRarityChange = (
  dispatch: React.Dispatch<FormActionI>
) => {
  return (layerName: string) => {
    return (e: InputEventT, imageId: string): void => {
      dispatch({
        type: FormActions.CHANGE_RARITY,
        payload: {
          rarityChange: { newRarity: e.target.value, imageId, layerName },
        },
      });
    };
  };
};

export const handleLayerReorder = (
  e: DragEndEvent,
  dispatch: React.Dispatch<FormActionI>
): void => {
  dispatch({
    type: FormActions.CHANGE_LAYER_PRECEDENCE,
    payload: { dragEndEvent: e },
  });
};

export const handleLayerProbChange =
  (layerName: string, dispatch: React.Dispatch<FormActionI>) =>
  (e: InputEventT): void => {
    dispatch({
      type: FormActions.CHANGE_LAYER_PROBABILITY,
      payload: {
        layerProbabilityChange: { layerName, newProbability: e.target.value },
      },
    });
  };

export const handleQuantityChange = (
  e: InputEventT,
  dispatch: React.Dispatch<FormActionI>
): void => {
  inputDispatch(e, dispatch, FormActions.CHANGE_QUANTITY, "quantity");
};
