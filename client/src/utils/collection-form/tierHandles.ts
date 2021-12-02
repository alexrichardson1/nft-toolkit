import { DragEndEvent } from "@dnd-kit/core";
import FormActions from "actions/formActions";
import { FormActionI } from "reducers/formReducerTypes";

export const handleTierAdd = (
  newTierName: string,
  dispatch: React.Dispatch<FormActionI>
): void => {
  dispatch({
    type: FormActions.ADD_TIER,
    payload: { newTier: { name: newTierName } },
  });
};

export const handleTierRemoval = (
  tierName: string,
  dispatch: React.Dispatch<FormActionI>
): void => {
  dispatch({
    type: FormActions.REMOVE_TIER,
    payload: { deleteTierName: tierName },
  });
};

export const handleTierReorder = (
  e: DragEndEvent,
  dispatch: React.Dispatch<FormActionI>
): void => {
  dispatch({
    type: FormActions.CHANGE_TIER_PRECEDENCE,
    payload: { dragEndEvent: e },
  });
};

export const handleTierProbChange = (
  tierName: string,
  dispatch: React.Dispatch<FormActionI>
) => {
  return (e: InputEventT): void => {
    dispatch({
      type: FormActions.CHANGE_TIER_PROBABILITY,
      payload: {
        tierProbabilityChange: { tierName, newProbability: e.target.value },
      },
    });
  };
};
