import { wrongPage } from "utils/pages";

interface PropsT {
  pageNumber: number;
  generative: boolean;
  state: FormStateI;
}

const PAGE_3 = 3;

const GenArtStep = ({ generative, pageNumber }: PropsT): JSX.Element => {
  if (wrongPage(generative, pageNumber, PAGE_3)) {
    return <></>;
  }

  // return <ImageUploadTabs />;
  return <div></div>;
};

export default GenArtStep;
