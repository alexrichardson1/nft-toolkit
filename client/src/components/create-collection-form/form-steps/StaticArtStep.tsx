import Paper from "@mui/material/Paper";
import ImageUpload from "../custom-image-upload/ImageUpload";
import Tabs from "../tabs/Tabs";

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

  return (
    <>
      <Paper>
        <ImageUpload handleImageDrop={handleImageDrop} imgObjs={state.images} />
      </Paper>

      {state.images.length > 0 && (
        <Paper>
          <Tabs
            isLoading={isLoading}
            handleImageDelete={handleImageDelete}
            handleNameChange={handleImgNameChange}
            imgObjs={state.images}
          />
        </Paper>
      )}
    </>
  );
};

export default StaticArtForm;
