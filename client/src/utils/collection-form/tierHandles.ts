import { DragEndEvent } from "@dnd-kit/core";
import FormActions from "actions/formActions";
import { FormActionI } from "reducers/formReducerTypes";

export const handleTierAdd = (dispatch: React.Dispatch<FormActionI>) => {
  return (newTierName: string): void => {
    dispatch({
      type: FormActions.ADD_TIER,
      payload: { newTier: { name: newTierName } },
    });
  };
};

export const handleTierRemoval = (dispatch: React.Dispatch<FormActionI>) => {
  return (tierName: string): void => {
    dispatch({
      type: FormActions.REMOVE_TIER,
      payload: { deleteTierName: tierName },
    });
  };
};

export const handleTierReorder = (dispatch: React.Dispatch<FormActionI>) => {
  return (e: DragEndEvent): void => {
    dispatch({
      type: FormActions.CHANGE_TIER_PRECEDENCE,
      payload: { dragEndEvent: e },
    });
  };
};

export const handleTierProbChange = (dispatch: React.Dispatch<FormActionI>) => {
  return (tierName: string) => {
    return (e: InputEventT): void => {
      dispatch({
        type: FormActions.CHANGE_TIER_PROBABILITY,
        payload: {
          tierProbabilityChange: { tierName, newProbability: e.target.value },
        },
      });
    };
  };
};
