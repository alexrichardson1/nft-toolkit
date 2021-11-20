import { wrongPageGenerative } from "utils/pages";

interface PropsT {
  pageNumber: number;
  generative: boolean;
  state: FormStateI;
}

const LAYER_UPLOAD_PAGE = 3;

const GenArtStep = ({ generative, pageNumber }: PropsT): JSX.Element => {
  if (wrongPageGenerative(generative, pageNumber, LAYER_UPLOAD_PAGE)) {
    return <></>;
  }

  // return <ImageUploadTabs />;
  return <div></div>;
};

export default GenArtStep;
