import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import ImageUpload from "components/create-collection-form/custom-image-upload/ImageUpload";
import Tabs from "components/create-collection-form/tabs/Tabs";

interface PropsT {
  imgObjs: ImageT;
  NUMBER_OF_IMAGES: number;
  descriptionRequired?: boolean;
  isLoading: boolean;
  rarityRequired?: boolean;
  handleImgDelete: (deleteId: string) => void;
  handleImgNameChange: (e: InputEventT, id: string) => void;
  handleImgRarityChange: (e: InputEventT, id: string) => void;
  handleImgDescChange: (e: InputEventT, id: string) => void;
  handleImgDrop: (
    e: React.DragEvent<HTMLLabelElement> | React.ChangeEvent<HTMLInputElement>,
    imgObjs: FileList | null
  ) => void;
}

/**
 * @param imgObjs - image objects to render in tabs
 * @param NUMBER_OF_IMAGES - number of imgObjs
 * @param descriptionRequired - true if description is required (static only)
 * , false otherwise
 * @param isLoading - true if form is in loading state, false otherwise
 * @param rarityRequired - true if rarity is required (generative only), false
 * otherwise
 * @param handleImgDelete - handle deletion of image
 * @param handleImgRarityChange - handle rarity change for an image (generative
 * only)
 * @param handleImgNameChange - handle image name change
 * @param handleImgDrop - handle image drop into the ImageUpload component
 * @param handleImgDescChange - handle image description change
 */
const ImageUploadWithTabs = ({
  NUMBER_OF_IMAGES,
  imgObjs,
  handleImgDelete,
  handleImgDrop,
  handleImgNameChange,
  isLoading,
  descriptionRequired,
  handleImgRarityChange,
  rarityRequired,
  handleImgDescChange,
}: PropsT): JSX.Element => {
  return (
    <>
      <Box sx={{ width: 1 }}>
        <ImageUpload
          handleImageDrop={handleImgDrop}
          NUMBER_OF_IMAGES={NUMBER_OF_IMAGES}
        />
      </Box>

      {NUMBER_OF_IMAGES > 0 && (
        <Paper sx={{ width: 1 }}>
          <Tabs
            rarityRequired={rarityRequired}
            handleImgRarityChange={handleImgRarityChange}
            NUMBER_OF_IMAGES={NUMBER_OF_IMAGES}
            isLoading={isLoading}
            handleImageDelete={handleImgDelete}
            handleNameChange={handleImgNameChange}
            imgObjs={imgObjs}
            handleImgDescChange={handleImgDescChange}
            descriptionRequired={descriptionRequired}
          />
        </Paper>
      )}
    </>
  );
};

export default ImageUploadWithTabs;
