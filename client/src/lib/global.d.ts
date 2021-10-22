type AnchorType = null | HTMLElement;

type NetworkT = { icon: string; name: string; chainId?: number };

type VertPositionType = number | "top" | "center" | "bottom";
type HorizontalPositionType = number | "left" | "center" | "right";
type AnchorOriginType = {
  vertical: VertPositionType;
  horizontal: HorizontalPositionType;
};

type ImageListT = { image: File; url: string; name: string; id: string }[];

interface FormStateI {
  collectionName: string;
  description: string;
  images: ImageListT;
  mintingPrice: number;
}

type FormActionIypeT =
  | "CHANGE_NAME"
  | "CHANGE_PRICE"
  | "CHANGE_IMAGES"
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
  initialState?: FormStateI;
}

interface FormActionI {
  type: FormActionIypeT;
  payload: FormActionPayloadI;
}
