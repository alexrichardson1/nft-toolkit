import { DragEndEvent } from "@dnd-kit/core";
import FormActions from "actions/formActions";
import { FormActionI } from "reducers/formReducerTypes";

export const handleTwitterChange = (
  e: InputEventT,
  dispatch: React.Dispatch<FormActionI>
): void => {
  dispatch({
    type: FormActions.CHANGE_TWITTER_HANDLE,
    payload: { twitterHandleChange: e.target.value },
  });
};

export const handleRedditChange = (
  e: InputEventT,
  dispatch: React.Dispatch<FormActionI>
): void => {
  dispatch({
    type: FormActions.CHANGE_REDDIT_HANDLE,
    payload: { redditHandleChange: e.target.value },
  });
};

export const handleImageDelete = (
  deleteId: string,
  dispatch: React.Dispatch<FormActionI>,
  generative: boolean
) => {
  return (layerName = ""): void => {
    const payload = generative
      ? { deleteGen: { deleteId, layerName } }
      : { deleteId };
    dispatch({
      type: generative
        ? FormActions.DELETE_IMAGE_GEN
        : FormActions.DELETE_IMAGE_STATIC,
      payload,
    });
  };
};

export const handleImgDescChange = (
  e: InputEventT,
  dispatch: React.Dispatch<FormActionI>
) => {
  return (imageId: string): void => {
    dispatch({
      type: FormActions.CHANGE_IMAGE_DESC,
      payload: { imageDescChange: { imageId, newDesc: e.target.value } },
    });
  };
};

export const handleCollNameChange = (
  e: InputEventT,
  dispatch: React.Dispatch<FormActionI>
): void =>
  dispatch({
    type: FormActions.CHANGE_NAME,
    payload: { newName: e.target.value },
  });

export const handleMintPriceChange = (
  e: InputEventT,
  dispatch: React.Dispatch<FormActionI>
): void =>
  dispatch({
    type: FormActions.CHANGE_PRICE,
    payload: { price: e.target.value },
  });

export const handleLayerAddition = (
  newLayerName: string,
  dispatch: React.Dispatch<FormActionI>
): void => {
  dispatch({
    type: FormActions.ADD_LAYER,
    payload: { newLayer: { name: newLayerName } },
  });
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

export const handleTierRemoval = (
  tierName: string,
  dispatch: React.Dispatch<FormActionI>
): void => {
  dispatch({
    type: FormActions.REMOVE_TIER,
    payload: { deleteTierName: tierName },
  });
};

export const handleTierAdd = (
  newTierName: string,
  dispatch: React.Dispatch<FormActionI>
): void => {
  dispatch({
    type: FormActions.ADD_TIER,
    payload: { newTier: { name: newTierName } },
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

export const handleTierReorder = (
  e: DragEndEvent,
  dispatch: React.Dispatch<FormActionI>
): void => {
  dispatch({
    type: FormActions.CHANGE_TIER_PRECEDENCE,
    payload: { dragEndEvent: e },
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

export const handleSymbolChange = (
  e: InputEventT,
  dispatch: React.Dispatch<FormActionI>
): void => {
  dispatch({
    type: FormActions.CHANGE_SYMBOL,
    payload: { symbol: e.target.value },
  });
};

export const handleImgNameChange = (
  e: InputEventT,
  dispatch: React.Dispatch<FormActionI>,
  generative: boolean
) => {
  return (imageid: string, layerName = ""): void => {
    const payload = generative
      ? {
          modifyImgObjGen: {
            newImageName: e.target.value,
            imageId: imageid,
            layerName,
          },
        }
      : {
          modifyImgObjStatic: {
            newImageName: e.target.value,
            imageId: imageid,
          },
        };
    dispatch({
      type: generative
        ? FormActions.CHANGE_IMAGE_NAME_GEN
        : FormActions.CHANGE_IMAGE_NAME,
      payload,
    });
  };
};

export const handleImageDrop = (
  e: React.DragEvent<HTMLLabelElement> | React.ChangeEvent<HTMLInputElement>,
  dispatch: React.Dispatch<FormActionI>,
  generative: boolean
) => {
  return (imgObjs: FileList | null, layerName = ""): void => {
    e.preventDefault();
    if (!imgObjs) {
      return;
    }
    const payload = generative
      ? { newImagesGen: { images: Array.from(imgObjs), layerName } }
      : { newImagesStatic: Array.from(imgObjs) };
    dispatch({
      type: generative
        ? FormActions.ADD_IMAGES_GEN
        : FormActions.ADD_IMAGES_STATIC,
      payload,
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

export const handleDescriptionChange = (
  e: InputEventT,
  dispatch: React.Dispatch<FormActionI>
): void => {
  dispatch({
    type: FormActions.CHANGE_DESCRIPTION,
    payload: { description: e.target.value },
  });
};

export const handleQuantityChange = (
  e: InputEventT,
  dispatch: React.Dispatch<FormActionI>
): void => {
  dispatch({
    type: FormActions.CHANGE_QUANTITY,
    payload: { quantity: e.target.value },
  });
};

export const handlePredictionsChange = (
  newPredictions: MlDataI,
  dispatch: React.Dispatch<FormActionI>
): void => {
  dispatch({
    type: FormActions.CHANGE_PREDICTIONS,
    payload: { newPredictions },
  });
};
