type AnchorType = null | HTMLElement;

type NetworksT = { icon: JSX.Element; name: string };

type VertPositionType = number | "top" | "center" | "bottom";
type HorizontalPositionType = number | "left" | "center" | "right";
type AnchorOriginType = {
  vertical: VertPositionType;
  horizontal: HorizontalPositionType;
};

type ImageListT = { image: File; url: string }[];

interface FormStateT {
  collectionName: string;
  description: string;
  images: ImageListT;
  mintingPrice: number;
}

type formActionIypeT =
  | "CHANGE_NAME"
  | "CHANGE_PRICE"
  | "CHANGE_IMAGES"
  | "CHANGE_DESCRIPTION";

type formActionPayloadT = string | File[] | number;

interface formActionI {
  type: formActionIypeT;
  payload: formActionPayloadT;
}
