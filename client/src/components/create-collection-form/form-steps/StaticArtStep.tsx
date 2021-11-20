import ImageUploadTabs from "components/common/ImageUploadTabs";
import { wrongPageStatic } from "utils/pages";

interface PropsT {
  pageNumber: number;
  generative: boolean;
  state: FormStateI;
  isLoading: boolean;
  handleImageDelete: (deleteId: string) => void;
  handleImgNameChange: (e: InputEventT, id: string) => void;
  handleImageDrop: (
    e: React.DragEvent<HTMLLabelElement> | React.ChangeEvent<HTMLInputElement>,
    imgObjs: FileList | null
  ) => void;
}

const STATIC_UPLOAD_PAGE = 2;

const StaticArtForm = ({
  pageNumber,
  generative,
  state,
  handleImageDelete,
  handleImageDrop,
  handleImgNameChange,
  isLoading,
}: PropsT): JSX.Element => {
  if (wrongPageStatic(generative, pageNumber, STATIC_UPLOAD_PAGE)) {
    return <></>;
  }

  const children = {
    state,
    handleImageDelete,
    handleImageDrop,
    handleImgNameChange,
    isLoading,
  };
  return <ImageUploadTabs {...children} />;
};

export default StaticArtForm;
