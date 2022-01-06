import { arrayMove } from "@dnd-kit/sortable";
import { undefinedCheck } from "utils/typeUtils";
import { FormActionI } from "./formReducerTypes";

const FILE_EXTENSION = /\.[^/.]+$/;
const DEFAULT_STRING = "";

/**
 * Returns an identifier for the image based on its name and size
 * @param name - name of image
 * @param size - size of image
 * @returns id for the image based on name and size
 */
export const getImgId = (name: string, size: number): string => name + size;

/**
 * Returns an image object whilst making a URL to store the image locally
 * @param image - the image file uploaded
 * @returns an image object based on the image
 */
export const getImgObj = (image: File): ImageI => ({
  name: image.name.replace(FILE_EXTENSION, DEFAULT_STRING),
  url: URL.createObjectURL(image),
  image: image,
  description: "",
});

export const getLayerObj = (name: string): LayerI => ({
  name,
  images: {},
  numberOfImages: 0,
  totalImageRarities: 0,
  probability: "100",
});

/**
 * Returns a tier object based on tier name
 * @param name - name of the tier
 * @returns a tier object
 */
const getTierObj = (name: string): TierI => ({
  name,
  probability: "",
});

const INITIAL_STATE: FormStateI = {
  twitterHandle: "",
  redditHandle: "",
  collectionName: "",
  description: "",
  symbol: "",
  mintingPrice: "",
  static: { images: {}, numberOfImages: 0 },
  generative: {
    numberOfTiers: 0,
    totalTierRarity: 0,
    tiers: [],
    layers: [],
    numberOfLayers: 0,
    quantity: "1",
  },
  marketplace: { wanted: false, royalty: "", allMint: false },
  predictions: { collections: [], hype: -1, price: "0" },
};

const containsDuplicates = (name: string, items: { name: string }[]) => {
  const newName = name.toLowerCase();
  return items.find(
    (item: { name: string }) => item.name.toLowerCase() === newName
  );
};

const addImagesStatic = (state: FormStateI, action: FormActionI) => {
  let newImages = 0;
  action.payload.newImagesStatic?.forEach((newImg) => {
    const newImgId = getImgId(newImg.name, newImg.size);
    if (!(newImgId in state.static.images)) {
      state.static.images[newImgId] = getImgObj(newImg);
      newImages++;
    }
  });
  state.static.numberOfImages += newImages;
  return { ...state };
};

const changeImageDescStatic = (state: FormStateI, action: FormActionI) => {
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
const changeImageNameStatic = (state: FormStateI, action: FormActionI) => {
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
const deleteImageStatic = (state: FormStateI, action: FormActionI) => {
  const deleteId = undefinedCheck(action.payload.deleteId, "deleteId required");
  const imgUrl = state.static.images[deleteId]?.url;
  delete state.static.images[deleteId];
  state.static.numberOfImages--;
  if (imgUrl) {
    URL.revokeObjectURL(imgUrl);
  }
  return { ...state };
};
const addImagesGen = (state: FormStateI, action: FormActionI) => {
  const imgsToAdd = undefinedCheck(
    action.payload.newImagesGen,
    "newImagesGen required"
  );
  state.generative.layers.forEach((layer) => {
    if (layer.name === imgsToAdd.layerName) {
      let newImages = 0;
      imgsToAdd.images.forEach((newImg) => {
        const newImgId = getImgId(newImg.name, newImg.size);
        if (!(newImgId in layer.images)) {
          layer.images[newImgId] = {
            ...getImgObj(newImg),
            rarity: DEFAULT_STRING,
          };
          newImages++;
        }
      });
      layer.numberOfImages += newImages;
    }
  });
  return { ...state };
};
const changeImageNameGen = (state: FormStateI, action: FormActionI) => {
  const modifyImgGen = undefinedCheck(
    action.payload.modifyImgObjGen,
    "modifyImgObjGen required"
  );
  state.generative.layers.forEach((layer) => {
    if (layer.name === modifyImgGen.layerName) {
      const img = undefinedCheck(
        layer.images[modifyImgGen.imageId],
        "Image not found"
      );
      img.name = modifyImgGen.newImageName;
    }
  });
  return { ...state };
};
const changeRarityGen = (state: FormStateI, action: FormActionI) => {
  const rarityChange = undefinedCheck(
    action.payload.rarityChange,
    "rarityChange required"
  );
  state.generative.layers.forEach((layer) => {
    if (layer.name === rarityChange.layerName) {
      const img = undefinedCheck(
        layer.images[rarityChange.imageId],
        "Image not found"
      );
      const oldRarity = Number(img.rarity ?? DEFAULT_STRING);
      const newRarity = Number(rarityChange.newRarity);
      img.rarity = rarityChange.newRarity;
      layer.totalImageRarities += newRarity - oldRarity;
    }
  });
  return { ...state };
};
const deleteImageGen = (state: FormStateI, action: FormActionI) => {
  const deleteObjGen = undefinedCheck(
    action.payload.deleteGen,
    "deleteGen required"
  );
  state.generative.layers.forEach((layer) => {
    if (layer.name === deleteObjGen.layerName) {
      const img = undefinedCheck(
        layer.images[deleteObjGen.deleteId],
        "Image does not exist"
      );
      const imgUrl = img.url;
      layer.totalImageRarities -= Number(img.rarity ?? DEFAULT_STRING);
      delete layer.images[deleteObjGen.deleteId];
      layer.numberOfImages--;
      if (imgUrl) {
        URL.revokeObjectURL(imgUrl);
      }
    }
  });
  return { ...state };
};
const addLayer = (state: FormStateI, action: FormActionI) => {
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
const changeLayerProb = (state: FormStateI, action: FormActionI) => {
  const layerProbabilityChange = undefinedCheck(
    action.payload.layerProbabilityChange,
    "layerProbabilityChange required"
  );
  state.generative.layers.forEach((layer) => {
    if (layer.name === layerProbabilityChange.layerName) {
      layer.probability = layerProbabilityChange.newProbability;
    }
  });
  return { ...state };
};
const changeLayerPrecedence = (state: FormStateI, action: FormActionI) => {
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

const removeLayer = (state: FormStateI, action: FormActionI) => {
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
  state.generative.numberOfLayers--;
  return { ...state };
};
const addTier = (state: FormStateI, action: FormActionI) => {
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
const changeTierProb = (state: FormStateI, action: FormActionI) => {
  const tierProbabilityChange = undefinedCheck(
    action.payload.tierProbabilityChange,
    "tierProbabilityChange required"
  );
  let newTotalRarity = 0;
  state.generative.tiers.forEach((tier) => {
    if (tier.name === tierProbabilityChange.tierName) {
      tier.probability = tierProbabilityChange.newProbability;
    }
    newTotalRarity += Number(tier.probability);
  });
  state.generative.totalTierRarity = newTotalRarity;
  return { ...state };
};
const changeTierPrecedence = (state: FormStateI, action: FormActionI) => {
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
const removeTier = (state: FormStateI, action: FormActionI) => {
  const deleteTierName = undefinedCheck(
    action.payload.deleteTierName,
    "deleteTierName required"
  );
  state.generative.tiers = state.generative.tiers.filter((tier) => {
    if (tier.name === deleteTierName) {
      state.generative.totalTierRarity -= Number(tier.probability);
      return false;
    }
    return true;
  });
  state.generative.numberOfTiers--;
  return { ...state };
};
const changePredictions = (state: FormStateI, action: FormActionI) => {
  const predictions = undefinedCheck(
    action.payload.newPredictions,
    "newPredictions required"
  );
  return { ...state, predictions };
};
const changeSymbol = (state: FormStateI, action: FormActionI): FormStateI => {
  return { ...state, symbol: action.payload.symbol ?? DEFAULT_STRING };
};
const changeRedditHandle = (
  state: FormStateI,
  action: FormActionI
): FormStateI => {
  return {
    ...state,
    redditHandle: action.payload.redditHandleChange ?? DEFAULT_STRING,
  };
};
const changeTwitterHandle = (
  state: FormStateI,
  action: FormActionI
): FormStateI => {
  return {
    ...state,
    twitterHandle: action.payload.twitterHandleChange ?? DEFAULT_STRING,
  };
};
const changePrice = (state: FormStateI, action: FormActionI): FormStateI => {
  return {
    ...state,
    mintingPrice: action.payload.price ?? DEFAULT_STRING,
  };
};
const changeDescription = (
  state: FormStateI,
  action: FormActionI
): FormStateI => {
  return {
    ...state,
    description: action.payload.description ?? DEFAULT_STRING,
  };
};
const changeName = (state: FormStateI, action: FormActionI): FormStateI => {
  return {
    ...state,
    collectionName: action.payload.newName ?? DEFAULT_STRING,
  };
};
const changeQuantity = (state: FormStateI, action: FormActionI): FormStateI => {
  return {
    ...state,
    generative: {
      ...state.generative,
      quantity: action.payload.quantity ?? DEFAULT_STRING,
    },
  };
};
const resetState = (): FormStateI => {
  return JSON.parse(JSON.stringify(INITIAL_STATE));
};
const changeMarketplaceWanted = (
  state: FormStateI,
  action: FormActionI
): FormStateI => {
  const newWanted = undefinedCheck(
    action.payload.mplaceWantedChange,
    "mplaceWantedChange required"
  );
  return { ...state, marketplace: { ...state.marketplace, wanted: newWanted } };
};
const changeMarketplaceRoyalty = (
  state: FormStateI,
  action: FormActionI
): FormStateI => {
  return {
    ...state,
    marketplace: {
      ...state.marketplace,
      royalty: action.payload.mplaceRoyaltyChange ?? DEFAULT_STRING,
    },
  };
};
const changeMarketplaceAllMint = (
  state: FormStateI,
  action: FormActionI
): FormStateI => {
  const newAllMint = undefinedCheck(
    action.payload.mplaceAllMintChange,
    "mplaceAllMintChange required"
  );
  return {
    ...state,
    marketplace: { ...state.marketplace, allMint: newAllMint },
  };
};

/**
 * @param state - current state of the form
 * @param action - object containting type of action to perform and payload
 * required for the action to be performed
 * @returns The state of the form
 */
const formReducer = (state: FormStateI, action: FormActionI): FormStateI => {
  const reducers = [
    // collection details
    changeName,
    changePrice,
    changeSymbol,
    changeDescription,
    // image uploads
    addImagesStatic,
    deleteImageStatic,
    changeImageNameStatic,
    changeImageDescStatic,
    addImagesGen,
    changeImageNameGen,
    deleteImageGen,
    // tiers
    addTier,
    removeTier,
    changeTierPrecedence,
    changeTierProb,
    // layers
    addLayer,
    removeLayer,
    changeRarityGen,
    changeLayerPrecedence,
    changeLayerProb,
    changeQuantity,
    // resets
    resetState,
    // predictions
    changePredictions,
    changeTwitterHandle,
    changeRedditHandle,
    // marketplace
    changeMarketplaceWanted,
    changeMarketplaceRoyalty,
    changeMarketplaceAllMint,
  ];
  const reducer = undefinedCheck(
    reducers[action.type],
    "Invalid action provided"
  );
  return reducer(state, action);
};

export default formReducer;
