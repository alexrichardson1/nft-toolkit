import { AlertColor, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import { SxProps } from "@mui/system";
import { useWeb3React } from "@web3-react/core";
import FormActions from "actions/formActions";
import SnackbarContext from "context/snackbar/SnackbarContext";
import useCounter from "hooks/useCounter";
import { FormEvent, useContext, useEffect, useReducer, useState } from "react";
import { Redirect } from "react-router-dom";
import formReducer from "reducers/formReducer";
import {
  handleCollNameChange,
  handleDescriptionChange,
  handleMintPriceChange,
  handleSymbolChange,
} from "utils/collection-form/collectionHandles";
import {
  GEN_STEPS,
  handleFormSubmit,
  STATIC_STEPS,
} from "utils/collection-form/formHandles";
import {
  handleImageDelete,
  handleImageDrop,
  handleImgDescChange,
  handleImgNameChange,
} from "utils/collection-form/imageHandles";
import {
  handleImgRarityChange,
  handleLayerAddition,
  handleLayerProbChange,
  handleLayerRemoval,
  handleLayerReorder,
  handleQuantityChange,
} from "utils/collection-form/layerHandles";
import {
  handleMplaceRoyaltyChange,
  handleMplaceWantedChange,
} from "utils/collection-form/marketplaceHandles";
import {
  handleRedditChange,
  handleTwitterChange,
} from "utils/collection-form/predictionHandles";
import {
  handleTierAdd,
  handleTierProbChange,
  handleTierRemoval,
  handleTierReorder,
} from "utils/collection-form/tierHandles";
import { DEFAULT_ALERT_DURATION } from "utils/constants";
import showAlert from "utils/showAlert";
import GeneralInfoStep from "./form-steps/GeneralInfoStep";
import LayerImageUpload from "./form-steps/LayerImageUpload";
import LayerSelectionStep from "./form-steps/LayerSelectionStep";
import RecommendationsStep from "./form-steps/RecommendationsStep";
import StaticArtStep from "./form-steps/StaticArtStep";
import TierSelectionStep from "./form-steps/TierSelectionStep";
import TypeOfArtStep from "./form-steps/TypeOfArtStep";
import FormAlert from "./FormAlert";
import FormButtons from "./FormButtons";
const INITIAL_STEP_NUMBER = 0;
const INITIAL_STATE: FormStateI = {
  twitterHandle: "",
  redditHandle: "",
  collectionName: "",
  description: "",
  symbol: "",
  mintingPrice: "",
  static: { images: {}, numberOfImages: 0 },
  generative: {
    numberOfTiers: 0,
    totalTierRarity: 0,
    tiers: [],
    layers: [],
    numberOfLayers: 0,
    quantity: "1",
  },
  marketplace: { wanted: false, royalty: "" },
  predictions: { names: [], hype: -1, price: -1 },
};
const formFooterStyle: SxProps = {
  display: "flex",
  gap: "10px",
  minHeight: 50,
  flexDirection: { xs: "column", sm: "row" },
};

const CreateCollectionForm = (): JSX.Element => {
  const { active, account, chainId, library } = useWeb3React();
  const { showSnackbar } = useContext(SnackbarContext);
  const [state, dispatch] = useReducer(formReducer, INITIAL_STATE);
  const [stepNumber, handleNextStep, handlePrevStep] =
    useCounter(INITIAL_STEP_NUMBER);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState<AlertColor>("success");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [generative, setGenerative] = useState(false);
  const [txAddress, setTxAddress] = useState("");
  const [newCollName, setNewCollName] = useState("");
  const [newMintingPrice, setNewMintingPrice] = useState(0);
  useEffect(() => {
    if (stepNumber === INITIAL_STEP_NUMBER) {
      setGenerative(false);
      dispatch({ type: FormActions.RESET_TYPE_OF_ART, payload: {} });
    }
  }, [stepNumber]);
  const IS_LAST_STEP =
    stepNumber === (generative ? GEN_STEPS - 1 : STATIC_STEPS - 1);
  const closeAlert = () => setAlertMessage("");

  const showFormAlert = (severity: AlertColor, message: string) => {
    showAlert(setAlertSeverity, severity, setAlertMessage, message);
    setTimeout(closeAlert, DEFAULT_ALERT_DURATION);
  };
  if (txAddress !== "") {
    return <Redirect to={`/${chainId}/${txAddress}`} />;
  }

  return (
    <Stack
      onSubmit={(e: FormEvent<Element>) =>
        handleFormSubmit(
          e,
          active,
          account,
          chainId,
          showSnackbar,
          IS_LAST_STEP,
          generative,
          stepNumber,
          state,
          showFormAlert,
          setLoadingMessage,
          setIsLoading,
          dispatch,
          setNewCollName,
          setNewMintingPrice,
          handleNextStep,
          newCollName,
          newMintingPrice,
          library,
          setTxAddress
        )
      }
      component="form"
      justifyContent="center"
      spacing={2}
      data-testid="create-form">
      <GeneralInfoStep
        state={state}
        generative={generative}
        stepNumber={stepNumber}
        handleRedditChange={handleRedditChange(dispatch)}
        handleSymbolChange={handleSymbolChange(dispatch)}
        handleTwitterChange={handleTwitterChange(dispatch)}
        handleCollNameChange={handleCollNameChange(dispatch)}
        handleMintPriceChange={handleMintPriceChange(dispatch)}
        handleDescriptionChange={handleDescriptionChange(dispatch)}
        handleMplaceWantedChange={handleMplaceWantedChange(dispatch)}
        handleMplaceRoyaltyChange={handleMplaceRoyaltyChange(dispatch)}
      />
      <TypeOfArtStep
        stepNumber={stepNumber}
        setGenerative={setGenerative}
        handleNextStep={handleNextStep}
      />
      <StaticArtStep
        state={state}
        isLoading={isLoading}
        generative={generative}
        stepNumber={stepNumber}
        handleImgDrop={handleImageDrop(dispatch, generative)}
        handleImgDelete={handleImageDelete(dispatch, generative)}
        handleImgNameChange={handleImgNameChange(dispatch, generative)}
        handleImgDescChange={handleImgDescChange(dispatch)}
      />
      <TierSelectionStep
        state={state}
        stepNumber={stepNumber}
        generative={generative}
        handleTierAdd={handleTierAdd(dispatch)}
        handleTierRemoval={handleTierRemoval(dispatch)}
        handleTierReorder={handleTierReorder(dispatch)}
        handleTierProbChange={handleTierProbChange(dispatch)}
      />
      <LayerSelectionStep
        state={state}
        stepNumber={stepNumber}
        generative={generative}
        handleLayerRemoval={handleLayerRemoval(dispatch)}
        handleLayerReorder={handleLayerReorder(dispatch)}
        handleLayerAddition={handleLayerAddition(dispatch)}
        handleLayerProbChange={handleLayerProbChange(dispatch)}
      />
      <LayerImageUpload
        state={state}
        isLoading={isLoading}
        stepNumber={stepNumber}
        generative={generative}
        handleLayerImgDrop={handleImageDrop(dispatch, generative)}
        handleQuantityChange={handleQuantityChange(dispatch)}
        handleLayerImgDelete={handleImageDelete(dispatch, generative)}
        handleImgRarityChange={handleImgRarityChange(dispatch)}
        handleLayerImgNameChange={handleImgNameChange(dispatch, generative)}
      />
      <RecommendationsStep
        state={state}
        isLoading={isLoading}
        stepNumber={stepNumber}
        generative={generative}
        changedCollName={newCollName}
        handleChangeCollName={setNewCollName}
        changedMintingPrice={newMintingPrice}
        handleChangeMintingPrice={setNewMintingPrice}
      />
      <Box sx={formFooterStyle}>
        <FormAlert
          closeAlert={closeAlert}
          alertMessage={alertMessage}
          alertSeverity={alertSeverity}
        />
        <FormButtons
          isLoading={isLoading}
          isLastStep={IS_LAST_STEP}
          stepNumber={stepNumber}
          loadingMessage={loadingMessage}
          handlePrevStep={handlePrevStep}
        />
      </Box>
    </Stack>
  );
};
export default CreateCollectionForm;
