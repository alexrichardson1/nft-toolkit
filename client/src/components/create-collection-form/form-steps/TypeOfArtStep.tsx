import Grid from "@mui/material/Grid";
import ChoiceCard from "components/common/ChoiceCard";
import genArtImg from "images/generative-icon.svg";
import staticArtImg from "images/static-icon.svg";
import { useCallback } from "react";
import { pure } from "recompose";
import { wrongStep } from "utils/pages";

const ART_TYPE_STEP_NUMBER = 0;
const GEN_ART_DESC = (
  <>
    Dynamically generate an NFT collection using multi-layered images
    <ul style={{ marginTop: 0, marginBottom: 0 }}>
      <li> Provide layers you wish each NFT to include</li>
      <li> Upload your images for each layer with respective rarities</li>
      <li>
        Sit back whilst we generate your NFTs via smart contracts and deploy the
        collection!
      </li>
    </ul>
  </>
);
const STATIC_ART_DESC = (
  <>
    Create a static NFT collection
    <ul style={{ marginTop: 0, marginBottom: 0 }}>
      <li>Upload all of your static images</li>
      <li>Give each image a name and a description</li>
      <li>
        Sit back whilst we generate your NFTs via smart contracts and deploy the
        collection!
      </li>
    </ul>
  </>
);

interface PropsT {
  stepNumber: number;
  handleNextStep: () => void;
  setGenerative: SetStateAction<boolean>;
}

/**
 * Step of the form which allows users to select which type of art they want to
 * upload (static or generative) and takes them to the next step based on this
 * choice
 * @param setGenerative - sets the `generative` boolean true if generative type
 * of art selected by user
 * @param handleNextStep - go to next step based on user choice
 * @param stepNumber - current step the form is on (must equal
 * ART_TYPE_STEP_NUMBER for this step to render)
 */
const TypeOfArtStep = ({
  setGenerative,
  handleNextStep,
  stepNumber,
}: PropsT): JSX.Element => {
  const handleGenerativeCardClick = useCallback(() => {
    setGenerative(true);
    handleNextStep();
  }, [handleNextStep, setGenerative]);

  if (wrongStep(stepNumber, ART_TYPE_STEP_NUMBER)) {
    return <></>;
  }

  return (
    <Grid container spacing={2}>
      <ChoiceCard
        handleCardClick={handleGenerativeCardClick}
        imgSrc={genArtImg}
        description={GEN_ART_DESC}
        title="Generative Art"
      />
      <ChoiceCard
        handleCardClick={handleNextStep}
        imgSrc={staticArtImg}
        description={STATIC_ART_DESC}
        title="Static Art"
      />
    </Grid>
  );
};

export default pure(TypeOfArtStep);
