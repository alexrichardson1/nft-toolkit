import { DragEndEvent } from "@dnd-kit/core";
import FormActions from "actions/formActions";

interface FormActionPayloadI {
  quantity?: string;
  newName?: string;
  description?: string;
  price?: string;
  symbol?: string;
  newLayer?: { name: string };
  newTier?: { name: string };
  newImagesGen?: { images: File[]; layerName: string };
  newImagesStatic?: File[];
  modifyImgObjStatic?: { newImageName: string; imageId: string };
  modifyImgObjGen?: {
    newImageName: string;
    imageId: string;
    layerName: string;
  };
  tierProbabilityChange?: { tierName: string; newProbability: string };
  layerProbabilityChange?: { layerName: string; newProbability: string };
  deleteId?: string;
  deleteGen?: { deleteId: string; layerName: string };
  dragEndEvent?: DragEndEvent;
  deleteLayerName?: string;
  deleteTierName?: string;
  imageDescChange?: { imageId: string; newDesc: string };
  rarityChange?: { layerName: string; imageId: string; newRarity: string };
  newPredictions?: MlDataI;
  twitterHandleChange?: string;
  redditHandleChange?: string;
}

export interface FormActionI {
  type: FormActions;
  payload: FormActionPayloadI;
}
