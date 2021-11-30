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
  generative: {
    numberOfTiers: 0,
    tiers: [],
    layers: [],
    numberOfLayers: 0,
    quantity: "1",
  },
};

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

/**
 * Checks if `value` is undefined. Used for type narrowing from `T | undefined` to `T`
 * @param value - Any value
 * @param message - Error message if value is `undefined`
 * @throws - Error with `message`
 * @returns `value` with type T
 */
const undefinedCheck = <T>(value: T | undefined, message: string): T => {
  if (!value) {
    throw new Error(message);
  }
  return value;
};

const containsDuplicates = (name: string, items: { name: string }[]) => {
  const newName = name.toLowerCase();
  return items.find(
    (item: { name: string }) => item.name.toLowerCase() === newName
  );
};

const addImagesGen = (action: FormActionI, state: FormStateI) => {
  const imgsToAdd = undefinedCheck(
    action.payload.newImagesGen,
    "nImagesGen required"
  );
  state.generative.layers.forEach((layer) => {
    if (layer.name === imgsToAdd.layerName) {
      let newImages = 0;
      imgsToAdd.images.forEach((newImg) => {
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
  const modifyImgObj = undefinedCheck(
    action.payload.modifyImgObjStatic,
    "modifyImgObjStatic required"
  );
  const img = undefinedCheck(
    state.static.images[modifyImgObj.imageId],
    "Relevant Image not present"
  );
  img.name = modifyImgObj.newImageName;
  return { ...state };
};

const changeImageNameGen = (action: FormActionI, state: FormStateI) => {
  const modifyImgGen = undefinedCheck(
    action.payload.modifyImgObjGen,
    "modifyImgObjGen required"
  );
  state.generative.layers.forEach((layer) => {
    if (layer.name === modifyImgGen.layerName) {
      const img = layer.images[modifyImgGen.imageId];

      if (!img) {
        throw new Error("Image not found");
      }
      img.name = modifyImgGen.newImageName;
    }
  });
  return { ...state };
};

const deleteImageGen = (action: FormActionI, state: FormStateI) => {
  const deleteObjGen = undefinedCheck(
    action.payload.deleteGen,
    "deleteGen required"
  );
  state.generative.layers.forEach((layer) => {
    if (layer.name === deleteObjGen.layerName) {
      const imgUrl = layer.images[deleteObjGen.deleteId]?.url;
      delete layer.images[deleteObjGen.deleteId];
      layer.numberOfImages--;
      if (imgUrl) {
        URL.revokeObjectURL(imgUrl);
      }
    }
  });
  return { ...state };
};

const changeImageDesc = (action: FormActionI, state: FormStateI) => {
  const imgDescChange = undefinedCheck(
    action.payload.imageDescChange,
    "imageDescChange required"
  );
  const img = undefinedCheck(
    state.static.images[imgDescChange.imageId],
    "Image does not exist"
  );
  img.description = imgDescChange.newDesc;
  return { ...state };
};

const deleteImageStatic = (action: FormActionI, state: FormStateI) => {
  const deleteId = undefinedCheck(action.payload.deleteId, "deleteId required");
  const imgUrl = state.static.images[deleteId]?.url;
  delete state.static.images[deleteId];
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
  const rarityChange = undefinedCheck(
    action.payload.rarityChange,
    "rarityChange required"
  );

  state.generative.layers.forEach((layer) => {
    if (layer.name === rarityChange.layerName) {
      const img = layer.images[rarityChange.imageId];
      if (!img) {
        throw new Error("Image does not exist");
      }
      img.rarity = rarityChange.newRarity;
    }
  });

  return { ...state };
};

const changeTierProb = (action: FormActionI, state: FormStateI) => {
  const tierProbabilityChange = undefinedCheck(
    action.payload.tierProbabilityChange,
    "tierProbabilityChange required"
  );
  state.generative.tiers.forEach((tier) => {
    if (tier.name === tierProbabilityChange.tierName) {
      tier.probability = tierProbabilityChange.newProbability;
    }
  });
  return { ...state };
};

const addLayer = (action: FormActionI, state: FormStateI) => {
  const newLayer = undefinedCheck(action.payload.newLayer, "newLayer required");

  if (containsDuplicates(newLayer.name, state.generative.layers)) {
    return { ...state };
  }

  return {
    ...state,
    generative: {
      ...state.generative,
      layers: [...state.generative.layers, getLayerObj(newLayer.name)],
      numberOfLayers: state.generative.numberOfLayers + 1,
    },
  };
};

const changeLayerPrecedence = (action: FormActionI, state: FormStateI) => {
  const dragEndEvent = undefinedCheck(
    action.payload.dragEndEvent,
    "dragEndEvent required"
  );
  const { active, over } = dragEndEvent;
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
  const deleteLayerName = undefinedCheck(
    action.payload.deleteLayerName,
    "deleteLayerName required"
  );
  state.generative.layers = state.generative.layers.filter((layer) => {
    if (layer.name !== deleteLayerName) {
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
  const deleteTierName = undefinedCheck(
    action.payload.deleteTierName,
    "deleteTierName required"
  );
  state.generative.tiers = state.generative.tiers.filter(
    (tier) => tier.name !== deleteTierName
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
  const newTier = undefinedCheck(action.payload.newTier, "newTier required");

  if (containsDuplicates(newTier.name, state.generative.tiers)) {
    return { ...state };
  }

  return {
    ...state,
    generative: {
      ...state.generative,
      tiers: [...state.generative.tiers, getTierObj(newTier.name)],
      numberOfTiers: state.generative.numberOfTiers + 1,
    },
  };
};

const changeTierPrecedence = (action: FormActionI, state: FormStateI) => {
  const dragEndEvent = undefinedCheck(
    action.payload.dragEndEvent,
    "dragEndEvent required"
  );
  const { active, over } = dragEndEvent;
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
          quantity: DEFAULT_STRING,
        },
      };
    case FormActions.CHANGE_QUANTITY: {
      state.generative.quantity = action.payload.quantity ?? DEFAULT_STRING;
      return {
        ...state,
      };
    }
    // Reset form state
    case FormActions.RESET_STATE:
      return INITIAL_STATE;
    default:
      throw new Error("Invalid action provided");
  }
};

export default formReducer;
