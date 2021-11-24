import { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import FormActions from "actions/formActions";

const FILE_EXTENSION = /\.[^/.]+$/;
const DEFAULT_STRING = "";

export const getImgId = (name: string, size: number): string => size + name;

export const getImgObj = (image: File): ImageI => ({
  name: image.name.replace(FILE_EXTENSION, ""),
  url: URL.createObjectURL(image),
  image: image,
});

export const getLayerId = (name: string): string => name;

export const getLayerObj = (name: string): LayerI => ({
  layerId: getLayerId(name),
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
}

interface FormActionI {
  type: FormActions;
  payload: FormActionPayloadI;
}

const formReducer = (state: FormStateI, action: FormActionI): FormStateI => {
  switch (action.type) {
    case FormActions.CHANGE_NAME:
      return {
        ...state,
        collectionName: action.payload.newName ?? DEFAULT_STRING,
      };

    case FormActions.CHANGE_DESCRIPTION:
      return {
        ...state,
        description: action.payload.description ?? DEFAULT_STRING,
      };

    case FormActions.CHANGE_SYMBOL:
      return { ...state, symbol: action.payload.symbol ?? DEFAULT_STRING };

    case FormActions.CHANGE_IMAGES: {
      let newImages = 0;
      action.payload.newImagesStatic?.forEach((newImg) => {
        newImages++;
        state.static.images[getImgId(newImg.name, newImg.size)] =
          getImgObj(newImg);
      });
      return {
        ...state,
        static: {
          ...state.static,
          numberOfImages: state.static.numberOfImages + newImages,
        },
      };
    }

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

    case FormActions.ADD_LAYER:
      if (!action.payload.newLayer) {
        throw new Error("newLayer required");
      }
      state.generative.layers = [
        ...state.generative.layers,
        getLayerObj(action.payload.newLayer.name),
      ];
      return {
        ...state,
        generative: {
          ...state.generative,
          numberOfLayers: state.generative.numberOfLayers + 1,
        },
      };

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

    case FormActions.CHANGE_IMAGES_GEN: {
      if (!action.payload.newImagesGen) {
        throw new Error("newImagesGen required");
      }
      state.generative.layers.forEach((layer) => {
        if (layer.layerId === action.payload.newImagesGen?.layerId) {
          let newImages = 0;
          action.payload.newImagesGen.images.forEach((newImg) => {
            layer.images[getImgId(newImg.name, newImg.size)] =
              getImgObj(newImg);
            newImages++;
          });
          layer.numberOfImages += newImages;
        }
      });
      return { ...state };
    }

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

    case FormActions.DELETE_IMAGE: {
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
    case FormActions.CHANGE_PRICE:
      return {
        ...state,
        mintingPrice: parseFloat(action.payload.price ?? DEFAULT_STRING),
      };

    case FormActions.RESET_STATE:
      return INITIAL_STATE;

    case FormActions.RESET_TYPE_OF_ART:
      return {
        ...state,
        static: { images: {}, numberOfImages: 0 },
        generative: { layers: [], numberOfLayers: 0 },
      };

    default:
      throw new Error("Invalid action provided");
  }
};

export default formReducer;
