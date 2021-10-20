type AnchorType = null | HTMLElement;

type NetworkT = { icon: string; name: string; chainId?: number };

type VertPositionType = number | "top" | "center" | "bottom";
type HorizontalPositionType = number | "left" | "center" | "right";
type AnchorOriginType = {
  vertical: VertPositionType;
  horizontal: HorizontalPositionType;
};

type ImageListT = { image: File; url: string }[];

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
  | "CHANGE_DESCRIPTION";

type FormActionPayloadT = string | File[] | number;

interface FormActionI {
  type: FormActionIypeT;
  payload: FormActionPayloadT;
}
