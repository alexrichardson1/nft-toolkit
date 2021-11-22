interface ProviderPropsI {
  children: React.ReactNode;
}

type NetworkT = { icon: string; name: string; chainId?: number };

type AnchorT = null | HTMLElement;

type InputEventT = React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>;

interface ImageI {
  image: File;
  url: string;
  name: string;
  description?: string;
}

type ImageT = { [imageId: string]: ImageI };

type LayerImageT = { [imageId: string]: ImageI & { rarity?: number } };
interface LayerI {
  layerId: string;
  name: string;
  description?: string;
  images: LayerImageT;
  numberOfImages: number;
}

interface FormStateI {
  collectionName: string;
  description: string;
  symbol: string;
  mintingPrice: number;
  static: { numberOfImages: number; images: ImageT };
  generative: { numberOfLayers: number; layers: LayerI[] };
}

type FormActionT =
  | "CHANGE_NAME"
  | "CHANGE_PRICE"
  | "CHANGE_SYMBOL"
  | "CHANGE_DESCRIPTION"
  | "RESET_STATE"
  | "CHANGE_IMAGES"
  | "CHANGE_IMAGE_NAME"
  | "DELETE_IMAGE"
  | "CHANGE_IMAGES_GEN"
  | "CHANGE_IMAGE_NAME_GEN"
  | "DELETE_IMAGE_GEN"
  | "ADD_LAYER"
  | "CHANGE_PRECEDENCE"
  | "REMOVE_LAYER";

interface FormActionPayloadI {
  newName?: string;
  description?: string;
  price?: string;
  symbol?: string;
  newLayer?: { name: string };
  newImagesGen?: { images: File[]; layerId: string };
  newImagesStatic?: File[];
  modifyImgObj?: { newImageName: string; imageId: string };
  deleteId?: string;
  dragEndEvent?: DragEndEvent;
  deleteLayerId?: string;
}

interface FormActionI {
  type: FormActionT;
  payload: FormActionPayloadI;
}
