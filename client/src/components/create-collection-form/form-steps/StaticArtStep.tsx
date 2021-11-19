import ImageUploadTabs from "components/common/ImageUploadTabs";

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

const PAGE_2 = 2;

const StaticArtForm = ({
  pageNumber,
  generative,
  state,
  handleImageDelete,
  handleImageDrop,
  handleImgNameChange,
  isLoading,
}: PropsT): JSX.Element => {
  if (pageNumber !== PAGE_2 || generative) {
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
