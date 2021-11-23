import { wrongStepGenerative } from "utils/pages";

interface PropsT {
  stepNumber: number;
  generative: boolean;
  state: FormStateI;
}

const LAYER_UPLOAD_STEP = 3;

const GenArtStep = ({ generative, stepNumber }: PropsT): JSX.Element => {
  if (wrongStepGenerative(generative, stepNumber, LAYER_UPLOAD_STEP)) {
    return <></>;
  }

  // return <ImageUploadTabs />;
  return <div></div>;
};

export default GenArtStep;
