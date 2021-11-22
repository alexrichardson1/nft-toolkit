import { arrayMove } from "@dnd-kit/sortable";

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
  mintingPrice: 0,
  static: { images: {}, numberOfImages: 0 },
  generative: { layers: [], numberOfLayers: 0 },
};

const formReducer = (state: FormStateI, action: FormActionI): FormStateI => {
  switch (action.type) {
    case "CHANGE_NAME":
      return {
        ...state,
        collectionName: action.payload.newName ?? DEFAULT_STRING,
      };

    case "CHANGE_DESCRIPTION":
      return {
        ...state,
        description: action.payload.description ?? DEFAULT_STRING,
      };

    case "CHANGE_SYMBOL":
      return { ...state, symbol: action.payload.symbol ?? DEFAULT_STRING };

    case "CHANGE_IMAGES":
      action.payload.newImagesStatic?.forEach((newImg) => {
        state.static.images[getImgId(newImg.name, newImg.size)] =
          getImgObj(newImg);
        state.static.numberOfImages++;
      });
      return { ...state };

    case "CHANGE_IMAGE_NAME": {
      if (!action.payload.modifyImgObj) {
        throw new Error("modifyImgObj required");
      }

      const img = state.static.images[action.payload.modifyImgObj.imageId];
      if (img) {
        img.name = action.payload.modifyImgObj.newImageName;
        throw new Error("Image does not exist");
      }
      return { ...state };
    }

    case "ADD_LAYER":
      if (!action.payload.newLayer) {
        throw new Error("newLayer required");
      }
      state.generative.layers = [
        ...state.generative.layers,
        getLayerObj(action.payload.newLayer.name),
      ];
      state.generative.numberOfLayers++;
      return { ...state };

    case "REMOVE_LAYER":
      if (!action.payload.deleteLayerId) {
        throw new Error("deleteLayerId required");
      }
      state.generative.layers = state.generative.layers.filter(
        (layer) => layer.layerId !== action.payload.deleteLayerId
      );
      return { ...state };

    case "CHANGE_IMAGES_GEN":
      return { ...state };

    case "CHANGE_PRECEDENCE": {
      if (!action.payload.dragEndEvent) {
        throw new Error("dragEndEvent required");
      }
      const { active, over } = action.payload.dragEndEvent;
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

    case "DELETE_IMAGE":
      if (!action.payload.deleteId) {
        throw new Error("deleteId required");
      }
      delete state.static.images[action.payload.deleteId];
      state.static.numberOfImages--;
      return { ...state };

    case "CHANGE_PRICE":
      return {
        ...state,
        mintingPrice: Number(action.payload.price ?? DEFAULT_STRING),
      };

    case "RESET_STATE":
      return INITIAL_STATE;

    default:
      throw new Error("Invalid action provided");
  }
};

export default formReducer;
