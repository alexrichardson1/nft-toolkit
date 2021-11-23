import { wrongPageStatic } from "utils/pages";
import ImageUploadWithTabs from "../ImageUploadWithTabs";

const STATIC_ART_STEP_NUMBER = 2;

interface PropsT {
  stepNumber: number;
  generative: boolean;
  state: FormStateI;
  isLoading: boolean;
  handleImgDelete: (deleteId: string) => void;
  handleImgNameChange: (e: InputEventT, id: string) => void;
  handleImgDrop: (
    e: React.DragEvent<HTMLLabelElement> | React.ChangeEvent<HTMLInputElement>,
    imgObjs: FileList | null
  ) => void;
}

/**
 * Step of the form which the user can only reach if they chose to upload static
 * images rather than using generative art
 *
 * @param stepNumber - current step the form is on (must equal
 * STATIC_ART_STEP_NUMBER for this step to render)
 * @param generative - false if the user wants to upload static art, True
 * otherwise (must be true for this step to render)
 * @param state - state of the form
 * @param handleImgDelete - handle deletion of Static Images
 * @param handleImgDrop - handle drop of images into image upload area
 * @param handleImgNameChange - handle name change for uploaded static images
 * @param isLoading - true if the form is in a loading state, False otherwise
 */
const StaticArtStep = ({
  stepNumber,
  generative,
  state,
  handleImgDelete,
  handleImgDrop,
  handleImgNameChange,
  isLoading,
}: PropsT): JSX.Element => {
  if (wrongPageStatic(generative, stepNumber, STATIC_ART_STEP_NUMBER)) {
    return <></>;
  }

  const children = {
    NUMBER_OF_IMAGES: state.static.numberOfImages,
    imgObjs: state.static.images,
    handleImgDelete,
    handleImgDrop,
    handleImgNameChange,
    isLoading,
  };

  return <ImageUploadWithTabs {...children} />;
};

export default StaticArtStep;
