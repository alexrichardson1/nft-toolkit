import { DragEndEvent } from "@dnd-kit/core";
import FormActions from "actions/formActions";
import { FormActionI } from "reducers/formReducerTypes";
import { inputDispatch } from "./formHandles";

export const handleLayerAddition = (dispatch: React.Dispatch<FormActionI>) => {
  return (newLayerName: string): void => {
    dispatch({
      type: FormActions.ADD_LAYER,
      payload: { newLayer: { name: newLayerName } },
    });
  };
};

export const handleLayerRemoval = (dispatch: React.Dispatch<FormActionI>) => {
  return (layerName: string): void => {
    dispatch({
      type: FormActions.REMOVE_LAYER,
      payload: { deleteLayerName: layerName },
    });
  };
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

export const handleLayerReorder = (dispatch: React.Dispatch<FormActionI>) => {
  return (e: DragEndEvent): void => {
    dispatch({
      type: FormActions.CHANGE_LAYER_PRECEDENCE,
      payload: { dragEndEvent: e },
    });
  };
};

export const handleLayerProbChange = (
  dispatch: React.Dispatch<FormActionI>
) => {
  return (layerName: string) => {
    return (e: InputEventT): void => {
      dispatch({
        type: FormActions.CHANGE_LAYER_PROBABILITY,
        payload: {
          layerProbabilityChange: { layerName, newProbability: e.target.value },
        },
      });
    };
  };
};

export const handleQuantityChange = (dispatch: React.Dispatch<FormActionI>) => {
  return (e: InputEventT): void => {
    inputDispatch(e, dispatch, FormActions.CHANGE_QUANTITY, "quantity");
  };
};
