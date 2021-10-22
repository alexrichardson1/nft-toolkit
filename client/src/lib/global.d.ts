interface ProviderPropsI {
  children: React.ReactNode;
}

type NetworkT = { icon: string; name: string; chainId?: number };

type AnchorT = null | HTMLElement;

interface InputPropsT {
  name?: string;
  label: React.ReactNode;
  value: unknown;
  placeholder: string;
  required?: boolean;
  multiline?: boolean;
  InputProps?: Partial<OutlinedInputProps>;
  rows?: number;
  onChange: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>;
  error?: string;
  type?: React.HTMLInputTypeAttribute;
  sx?: SxProps<Theme>;
}
type InputEventT = React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>;

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
