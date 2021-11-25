import { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import FormActions from "actions/formActions";

const FILE_EXTENSION = /\.[^/.]+$/;
const DEFAULT_STRING = "";

/**
 * Returns an identifier for the image based on its name and size
 *
 * @param name name of image
 * @param size size of image
 * @returns id for the image based on name and size
 */
export const getImgId = (name: string, size: number): string => size + name;

/**
 * Returns an image object whilst making a URL to store the image locally
 *
 * @param image the image file uploaded
 * @returns an image object based on the image
 */
export const getImgObj = (image: File): ImageI => ({
  name: image.name.replace(FILE_EXTENSION, ""),
  url: URL.createObjectURL(image),
  image: image,
});

/**
 * Returns the id of the layer based on its name
 *
 * @param name name of the layer
 * @returns id of layer based on name of the layer
 */
export const getLayerId = (name: string): string => name;

/**
 * Returns a layer object based on layer name and id
 *
 * @param name - name of the layer
 * @param id - id of the layer
 * @returns a layer object
 */
export const getLayerObj = (name: string, id: string): LayerI => ({
  layerId: id,
  name: name,
  images: {},
  numberOfImages: 0,
});

const INITIAL_STATE: FormStateI = {
  collectionName: "",
  description: "",
  symbol: "",
  mintingPrice: NaN,
  static: { images: {}, numberOfImages: 0 },
  generative: { layers: [], numberOfLayers: 0 },
};

interface FormActionPayloadI {
  newName?: string;
  description?: string;
  price?: string;
  symbol?: string;
  newLayer?: { name: string };
  newImagesGen?: { images: File[]; layerId: string };
  newImagesStatic?: File[];
  modifyImgObjStatic?: { newImageName: string; imageId: string };
  modifyImgObjGen?: { newImageName: string; imageId: string; layerId: string };
  deleteId?: string;
  deleteGen?: { deleteId: string; layerId: string };
  dragEndEvent?: DragEndEvent;
  deleteLayerId?: string;
  imageDescChange?: { imageId: string; newDesc: string };
}

interface FormActionI {
  type: FormActions;
  payload: FormActionPayloadI;
}

/**
 *
 * @param state - current state of the form
 * @param action - object containting type of action to perform and payload
 * required for the action to be performed
 * @returns
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
    case FormActions.ADD_IMAGES_STATIC: {
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
    }

    // Change name of a static image
    case FormActions.CHANGE_IMAGE_NAME: {
      if (!action.payload.modifyImgObjStatic) {
        throw new Error("modifyImgObj required");
      }
      const img =
        state.static.images[action.payload.modifyImgObjStatic.imageId];
      if (!img) {
        throw new Error("Image does not exist");
      }
      img.name = action.payload.modifyImgObjStatic.newImageName;
      return { ...state };
    }

    // Delete a static image
    case FormActions.DELETE_IMAGE_STATIC: {
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
    }

    // Change the desription of a static image
    case FormActions.CHANGE_IMAGE_DESC: {
      if (!action.payload.imageDescChange) {
        throw new Error("imageDescChange required");
      }

      const img = state.static.images[action.payload.imageDescChange.imageId];
      if (!img) {
        throw new Error("Image does not exist");
      }
      img.description = action.payload.imageDescChange.newDesc;
      return { ...state };
    }

    // Add new images within a layer for generative art
    case FormActions.ADD_IMAGES_GEN: {
      if (!action.payload.newImagesGen) {
        throw new Error("newImagesGen required");
      }
      state.generative.layers.forEach((layer) => {
        if (layer.layerId === action.payload.newImagesGen?.layerId) {
          let newImages = 0;
          action.payload.newImagesGen.images.forEach((newImg) => {
            const newImgId = getImgId(newImg.name, newImg.size);
            if (!(newImgId in layer.images)) {
              layer.images[newImgId] = getImgObj(newImg);
              newImages++;
            }
          });
          layer.numberOfImages += newImages;
        }
      });
      return { ...state };
    }

    // Delete an image within a layer for generative art
    case FormActions.DELETE_IMAGE_GEN:
      if (!action.payload.deleteGen) {
        throw new Error("deleteGen required");
      }
      state.generative.layers.forEach((layer) => {
        if (layer.layerId === action.payload.deleteGen?.layerId) {
          const imgUrl = layer.images[action.payload.deleteGen.deleteId]?.url;
          delete layer.images[action.payload.deleteGen.deleteId];
          layer.numberOfImages--;
          if (imgUrl) {
            URL.revokeObjectURL(imgUrl);
          }
        }
      });
      return { ...state };

    // Change the name of an image within a layer for generative art
    case FormActions.CHANGE_IMAGE_NAME_GEN:
      if (!action.payload.modifyImgObjGen) {
        throw new Error("modifyImgObjGen required");
      }
      state.generative.layers.forEach((layer) => {
        if (layer.layerId === action.payload.modifyImgObjGen?.layerId) {
          const img = layer.images[action.payload.modifyImgObjGen.imageId];

          if (!img) {
            throw new Error("Image not found");
          }
          img.name = action.payload.modifyImgObjGen.newImageName;
        }
      });
      return { ...state };

    // Change the precedence of a layer
    case FormActions.CHANGE_PRECEDENCE: {
      if (!action.payload.dragEndEvent) {
        throw new Error("dragEndEvent required");
      }
      const { active, over } = action.payload.dragEndEvent;
      if (!over) {
        return { ...state };
      }
      if (active.id !== over.id) {
        const oldIdx = state.generative.layers.findIndex(
          (layer) => layer.layerId === active.id
        );
        const newIdx = state.generative.layers.findIndex(
          (layer) => layer.layerId === over.id
        );
        state.generative.layers = arrayMove(
          state.generative.layers,
          oldIdx,
          newIdx
        );
      }
      return { ...state };
    }

    // Change the price of the collection
    case FormActions.CHANGE_PRICE:
      return {
        ...state,
        mintingPrice: parseFloat(action.payload.price ?? DEFAULT_STRING),
      };

    // Add a layer to the state
    case FormActions.ADD_LAYER: {
      if (!action.payload.newLayer) {
        throw new Error("newLayer required");
      }
      const newLayerId = getLayerId(action.payload.newLayer.name);
      if (
        state.generative.layers.find((layer) => layer.layerId === newLayerId)
      ) {
        return { ...state };
      }
      return {
        ...state,
        generative: {
          layers: [
            ...state.generative.layers,
            getLayerObj(action.payload.newLayer.name, newLayerId),
          ],
          numberOfLayers: state.generative.numberOfLayers + 1,
        },
      };
    }

    // Remove a layer from the state
    case FormActions.REMOVE_LAYER:
      if (!action.payload.deleteLayerId) {
        throw new Error("deleteLayerId required");
      }
      state.generative.layers = state.generative.layers.filter((layer) => {
        if (layer.layerId !== action.payload.deleteLayerId) {
          return true;
        }
        Object.values(layer.images).map((image) =>
          URL.revokeObjectURL(image.url)
        );
        return false;
      });
      return {
        ...state,
        generative: {
          ...state.generative,
          numberOfLayers: state.generative.numberOfLayers - 1,
        },
      };

    // Reset static and generative objects in the state
    case FormActions.RESET_TYPE_OF_ART:
      return {
        ...state,
        static: { images: {}, numberOfImages: 0 },
        generative: { layers: [], numberOfLayers: 0 },
      };

    // Reset form state
    case FormActions.RESET_STATE:
      return INITIAL_STATE;

    default:
      throw new Error("Invalid action provided");
  }
};

export default formReducer;
