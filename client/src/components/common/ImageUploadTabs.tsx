import Paper from "@mui/material/Paper";
import ImageUpload from "components/create-collection-form/custom-image-upload/ImageUpload";
import Tabs from "components/create-collection-form/tabs/Tabs";

interface PropsT {
  state: FormStateI;
  isLoading: boolean;
  handleImageDelete: (deleteId: string) => void;
  handleImgNameChange: (e: InputEventT, id: string) => void;
  handleImageDrop: (
    e: React.DragEvent<HTMLLabelElement> | React.ChangeEvent<HTMLInputElement>,
    imgObjs: FileList | null
  ) => void;
}

const StaticArtForm = ({
  state,
  handleImageDelete,
  handleImageDrop,
  handleImgNameChange,
  isLoading,
}: PropsT): JSX.Element => {
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
