import { wrongPageGenerative } from "utils/pages";

interface PropsT {
  stepNumber: number;
  generative: boolean;
  state: FormStateI;
}

const LAYER_UPLOAD_PAGE = 3;

const GenArtStep = ({ generative, stepNumber }: PropsT): JSX.Element => {
  if (wrongPageGenerative(generative, stepNumber, LAYER_UPLOAD_PAGE)) {
    return <></>;
  }

  // return <ImageUploadTabs />;
  return <div></div>;
};

export default GenArtStep;
