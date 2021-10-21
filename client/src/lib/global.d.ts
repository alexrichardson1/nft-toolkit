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
  | "CHANGE_IMAGE_NAME";

interface FormActionPayloadI {
  newName?: string;
  description?: string;
  images?: File[];
  newImageObj?: { newImageName: string; imageId: string };
  price?: string;
}

interface FormActionI {
  type: FormActionIypeT;
  payload: FormActionPayloadI;
}
