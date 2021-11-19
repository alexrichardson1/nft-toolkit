interface ProviderPropsI {
  children: React.ReactNode;
}

type NetworkT = { icon: string; name: string; chainId?: number };

type AnchorT = null | HTMLElement;

type InputEventT = React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>;

type ImageT = { image: File; url: string; name: string; id: string };
interface FormStateI {
  collectionName: string;
  description: string;
  symbol: string;
  images: ImageT[];
  mintingPrice: number;
}
type FormActionT =
  | "CHANGE_NAME"
  | "CHANGE_PRICE"
  | "CHANGE_IMAGES"
  | "CHANGE_SYMBOL"
  | "CHANGE_DESCRIPTION"
  | "CHANGE_IMAGE_NAME"
  | "DELETE_IMAGE"
  | "RESET_STATE";
interface FormActionPayloadI {
  newName?: string;
  description?: string;
  images?: File[];
  newImgObj?: { newImageName: string; imageId: string };
  price?: string;
  deleteId?: string;
  symbol?: string;
  initialState?: FormStateI;
}
interface FormActionI {
  type: FormActionT;
  payload: FormActionPayloadI;
}
