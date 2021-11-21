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

const ImageUploadTabs = ({
  state,
  handleImageDelete,
  handleImageDrop,
  handleImgNameChange,
  isLoading,
}: PropsT): JSX.Element => {
  return (
    <>
      <Paper>
        <ImageUpload
          handleImageDrop={handleImageDrop}
          NUMBER_OF_IMAGES={state.static.numberOfImages}
        />
      </Paper>

      {state.static.numberOfImages > 0 && (
        <Paper>
          <Tabs
            NUMBER_OF_IMAGES={state.static.numberOfImages}
            isLoading={isLoading}
            handleImageDelete={handleImageDelete}
            handleNameChange={handleImgNameChange}
            imgObjs={state.static.images}
          />
        </Paper>
      )}
    </>
  );
};

export default ImageUploadTabs;
