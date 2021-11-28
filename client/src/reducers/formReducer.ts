import { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import FormActions from "actions/formActions";

const FILE_EXTENSION = /\.[^/.]+$/;
const DEFAULT_STRING = "";

/**
 * Returns an identifier for the image based on its name and size
 *
 * @param name - name of image
 * @param size - size of image
 * @returns id for the image based on name and size
 */
export const getImgId = (name: string, size: number): string => name + size;

/**
 * Returns an image object whilst making a URL to store the image locally
 *
 * @param image - the image file uploaded
 * @returns an image object based on the image
 */
export const getImgObj = (image: File): ImageI => ({
  name: image.name.replace(FILE_EXTENSION, ""),
  url: URL.createObjectURL(image),
  image: image,
});

/**
 * Returns a layer object based on layer name and id
 *
 * @param name - name of the layer
 * @param id - id of the layer
 * @returns a layer object
 */
export const getLayerObj = (name: string): LayerI => ({
  name,
  images: {},
  numberOfImages: 0,
});

const getTierObj = (name: string): TierI => ({
  name,
  probability: "",
});

const INITIAL_STATE: FormStateI = {
  collectionName: "",
  description: "",
  symbol: "",
  mintingPrice: "",
  static: { images: {}, numberOfImages: 0 },
  generative: { numberOfTiers: 0, tiers: [], layers: [], numberOfLayers: 0 },
};

interface FormActionPayloadI {
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
  deleteId?: string;
  deleteGen?: { deleteId: string; layerName: string };
  dragEndEvent?: DragEndEvent;
  deleteLayerName?: string;
  deleteTierName?: string;
  imageDescChange?: { imageId: string; newDesc: string };
  rarityChange?: { layerName: string; imageId: string; newRarity: string };
}

interface FormActionI {
  type: FormActions;
  payload: FormActionPayloadI;
}

const addImagesGen = (action: FormActionI, state: FormStateI) => {
  if (!action.payload.newImagesGen) {
    throw new Error("newImagesGen required");
  }
  state.generative.layers.forEach((layer) => {
    if (layer.name === action.payload.newImagesGen?.layerName) {
      let newImages = 0;
      action.payload.newImagesGen.images.forEach((newImg) => {
        const newImgId = getImgId(newImg.name, newImg.size);
        if (!(newImgId in layer.images)) {
          layer.images[newImgId] = { ...getImgObj(newImg), rarity: "" };
          newImages++;
        }
      });
      layer.numberOfImages += newImages;
    }
  });
  return { ...state };
};

const addImagesStatic = (action: FormActionI, state: FormStateI) => {
  let newImages = 0;
  action.payload.newImagesStatic?.forEach((newImg) => {
    const newImgId = getImgId(newImg.name, newImg.size);
    if (!(newImgId in state.static.images)) {
      state.static.images[newImgId] = getImgObj(newImg);
      newImages++;
    }
  });
  return {
    ...state,
    static: {
      ...state.static,
      numberOfImages: state.static.numberOfImages + newImages,
    },
  };
};

const changeImageNameStatic = (action: FormActionI, state: FormStateI) => {
  if (!action.payload.modifyImgObjStatic) {
    throw new Error("modifyImgObj required");
  }
  const img = state.static.images[action.payload.modifyImgObjStatic.imageId];
  if (!img) {
    throw new Error("Image does not exist");
  }
  img.name = action.payload.modifyImgObjStatic.newImageName;
  return { ...state };
};

const changeImageNameGen = (action: FormActionI, state: FormStateI) => {
  if (!action.payload.modifyImgObjGen) {
    throw new Error("modifyImgObjGen required");
  }
  state.generative.layers.forEach((layer) => {
    if (layer.name === action.payload.modifyImgObjGen?.layerName) {
      const img = layer.images[action.payload.modifyImgObjGen.imageId];

      if (!img) {
        throw new Error("Image not found");
      }
      img.name = action.payload.modifyImgObjGen.newImageName;
    }
  });
  return { ...state };
};

const deleteImageGen = (action: FormActionI, state: FormStateI) => {
  if (!action.payload.deleteGen) {
    throw new Error("deleteGen required");
  }
  state.generative.layers.forEach((layer) => {
    if (layer.name === action.payload.deleteGen?.layerName) {
      const imgUrl = layer.images[action.payload.deleteGen.deleteId]?.url;
      delete layer.images[action.payload.deleteGen.deleteId];
      layer.numberOfImages--;
      if (imgUrl) {
        URL.revokeObjectURL(imgUrl);
      }
    }
  });
  return { ...state };
};

const changeImageDesc = (action: FormActionI, state: FormStateI) => {
  if (!action.payload.imageDescChange) {
    throw new Error("imageDescChange required");
  }

  const img = state.static.images[action.payload.imageDescChange.imageId];
  if (!img) {
    throw new Error("Image does not exist");
  }
  img.description = action.payload.imageDescChange.newDesc;
  return { ...state };
};

const deleteImageStatic = (action: FormActionI, state: FormStateI) => {
  if (!action.payload.deleteId) {
    throw new Error("deleteId required");
  }
  const imgUrl = state.static.images[action.payload.deleteId]?.url;
  delete state.static.images[action.payload.deleteId];
  if (imgUrl) {
    URL.revokeObjectURL(imgUrl);
  }
  return {
    ...state,
    static: {
      ...state.static,
      numberOfImages: state.static.numberOfImages - 1,
    },
  };
};

const changeRarity = (action: FormActionI, state: FormStateI) => {
  if (!action.payload.rarityChange) {
    throw new Error("rarityChange required");
  }

  state.generative.layers.forEach((layer) => {
    if (layer.name === action.payload.rarityChange?.layerName) {
      const img = layer.images[action.payload.rarityChange.imageId];
      if (!img) {
        throw new Error("Image does not exist");
      }
      img.rarity = action.payload.rarityChange.newRarity;
    }
  });

  return { ...state };
};

const changeTierProb = (action: FormActionI, state: FormStateI) => {
  if (!action.payload.tierProbabilityChange) {
    throw new Error("tierProbabilityChange required");
  }
  state.generative.tiers.forEach((tier) => {
    if (tier.name === action.payload.tierProbabilityChange?.tierName) {
      tier.probability = action.payload.tierProbabilityChange.newProbability;
    }
  });
  return { ...state };
};

const addLayer = (action: FormActionI, state: FormStateI) => {
  if (!action.payload.newLayer) {
    throw new Error("newLayer required");
  }
  if (
    state.generative.layers.find(
      (layer) => layer.name === action.payload.newLayer?.name
    )
  ) {
    return { ...state };
  }
  return {
    ...state,
    generative: {
      ...state.generative,
      layers: [
        ...state.generative.layers,
        getLayerObj(action.payload.newLayer.name),
      ],
      numberOfLayers: state.generative.numberOfLayers + 1,
    },
  };
};

const changeLayerPrecedence = (action: FormActionI, state: FormStateI) => {
  if (!action.payload.dragEndEvent) {
    throw new Error("dragEndEvent required");
  }
  const { active, over } = action.payload.dragEndEvent;
  if (!over) {
    return { ...state };
  }
  if (active.id !== over.id) {
    const oldIdx = state.generative.layers.findIndex(
      (layer) => layer.name === active.id
    );
    const newIdx = state.generative.layers.findIndex(
      (layer) => layer.name === over.id
    );
    state.generative.layers = arrayMove(
      state.generative.layers,
      oldIdx,
      newIdx
    );
  }
  return { ...state };
};

const removeLayer = (action: FormActionI, state: FormStateI) => {
  if (!action.payload.deleteLayerName) {
    throw new Error("deleteLayerName required");
  }
  state.generative.layers = state.generative.layers.filter((layer) => {
    if (layer.name !== action.payload.deleteLayerName) {
      return true;
    }
    Object.values(layer.images).map((image) => URL.revokeObjectURL(image.url));
    return false;
  });
  return {
    ...state,
    generative: {
      ...state.generative,
      numberOfLayers: state.generative.numberOfLayers - 1,
    },
  };
};

const removeTier = (action: FormActionI, state: FormStateI) => {
  if (!action.payload.deleteTierName) {
    throw new Error("deleteTierName required");
  }
  state.generative.tiers = state.generative.tiers.filter(
    (tier) => tier.name !== action.payload.deleteTierName
  );
  return {
    ...state,
    generative: {
      ...state.generative,
      numberOfTiers: state.generative.numberOfTiers - 1,
    },
  };
};

const addTier = (action: FormActionI, state: FormStateI) => {
  if (!action.payload.newTier) {
    throw new Error("newTier required");
  }
  if (
    state.generative.tiers.find(
      (tier) => tier.name === action.payload.newTier?.name
    )
  ) {
    return { ...state };
  }
  return {
    ...state,
    generative: {
      ...state.generative,
      tiers: [
        ...state.generative.tiers,
        getTierObj(action.payload.newTier.name),
      ],
      numberOfTiers: state.generative.numberOfTiers + 1,
    },
  };
};

const changeTierPrecedence = (action: FormActionI, state: FormStateI) => {
  if (!action.payload.dragEndEvent) {
    throw new Error("dragEndEvent required");
  }
  const { active, over } = action.payload.dragEndEvent;
  if (!over) {
    return { ...state };
  }
  if (active.id !== over.id) {
    const oldIdx = state.generative.tiers.findIndex(
      (tier) => tier.name === active.id
    );
    const newIdx = state.generative.tiers.findIndex(
      (tier) => tier.name === over.id
    );
    state.generative.tiers = arrayMove(state.generative.tiers, oldIdx, newIdx);
  }
  return { ...state };
};

/**
 *
 * @param state - current state of the form
 * @param action - object containting type of action to perform and payload
 * required for the action to be performed
 * @returns The state of the form
 */
const formReducer = (state: FormStateI, action: FormActionI): FormStateI => {
  switch (action.type) {
    // Change the name of the collection
    case FormActions.CHANGE_NAME:
      return {
        ...state,
        collectionName: action.payload.newName ?? DEFAULT_STRING,
      };

    // Change the description of the collection
    case FormActions.CHANGE_DESCRIPTION:
      return {
        ...state,
        description: action.payload.description ?? DEFAULT_STRING,
      };

    // Change the symbol of the collection
    case FormActions.CHANGE_SYMBOL:
      return { ...state, symbol: action.payload.symbol ?? DEFAULT_STRING };

    // Add new images to the static collection
    case FormActions.ADD_IMAGES_STATIC:
      return addImagesStatic(action, state);

    // Change name of a static image
    case FormActions.CHANGE_IMAGE_NAME:
      return changeImageNameStatic(action, state);

    // Delete a static image
    case FormActions.DELETE_IMAGE_STATIC:
      return deleteImageStatic(action, state);

    // Change the desription of a static image
    case FormActions.CHANGE_IMAGE_DESC:
      return changeImageDesc(action, state);

    // Add new images within a layer for generative art
    case FormActions.ADD_IMAGES_GEN:
      return addImagesGen(action, state);

    // Delete an image within a layer for generative art
    case FormActions.DELETE_IMAGE_GEN:
      return deleteImageGen(action, state);

    // Change the name of an image within a layer for generative art
    case FormActions.CHANGE_IMAGE_NAME_GEN:
      return changeImageNameGen(action, state);

    // Change the precedence of a layer
    case FormActions.CHANGE_LAYER_PRECEDENCE:
      return changeLayerPrecedence(action, state);

    // Change the rarity of an image within a layer
    case FormActions.CHANGE_RARITY:
      return changeRarity(action, state);

    // Change the price of the collection
    case FormActions.CHANGE_PRICE:
      return {
        ...state,
        mintingPrice: action.payload.price ?? DEFAULT_STRING,
      };

    // Add a layer to the state
    case FormActions.ADD_LAYER:
      return addLayer(action, state);

    // Remove a layer from the state
    case FormActions.REMOVE_LAYER:
      return removeLayer(action, state);

    // Add tier to state
    case FormActions.ADD_TIER:
      return addTier(action, state);

    // Change tier probabilities
    case FormActions.CHANGE_TIER_PROBABILITY:
      return changeTierProb(action, state);

    // Change tier precedence
    case FormActions.CHANGE_TIER_PRECEDENCE:
      return changeTierPrecedence(action, state);

    // Remove tier from state
    case FormActions.REMOVE_TIER:
      return removeTier(action, state);

    // Reset static and generative objects in the state
    case FormActions.RESET_TYPE_OF_ART:
      return {
        ...state,
        static: { images: {}, numberOfImages: 0 },
        generative: {
          numberOfTiers: 0,
          tiers: [],
          layers: [],
          numberOfLayers: 0,
        },
      };

    // Reset form state
    case FormActions.RESET_STATE:
      return INITIAL_STATE;

    default:
      throw new Error("Invalid action provided");
  }
};

export default formReducer;
