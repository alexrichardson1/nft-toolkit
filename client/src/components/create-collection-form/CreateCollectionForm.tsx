import { AlertColor, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import { SxProps } from "@mui/system";
import { useWeb3React } from "@web3-react/core";
import FormActions from "actions/formActions";
import SnackbarContext from "context/snackbar/SnackbarContext";
import { FormEvent, useContext, useEffect, useReducer, useState } from "react";
import { Redirect } from "react-router-dom";
import formReducer from "reducers/formReducer";
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
import {
  GEN_STEPS,
  handleCollNameChange,
  handleDescriptionChange,
  handleFormSubmit,
  handleImageDelete,
  handleImageDrop,
  handleImgDescChange,
  handleImgNameChange,
  handleImgRarityChange,
  handleLayerAddition,
  handleLayerRemoval,
  handleLayerReorder,
  handleMintPriceChange,
  handleQuantityChange,
  handleRedditChange,
  handleSymbolChange,
  handleTierAdd,
  handleTierProbChange,
  handleTierRemoval,
  handleTierReorder,
  handleTwitterChange,
  STATIC_STEPS,
} from "./FormHandles";

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
  predictions: { names: [], hype: -1 },
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
  const [stepNumber, setStepNumber] = useState(INITIAL_STEP_NUMBER);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState<AlertColor>("success");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [generative, setGenerative] = useState(false);
  const [txAddress, setTxAddress] = useState("");
  const [newCollName, setNewCollName] = useState("");
  useEffect(() => {
    if (stepNumber === INITIAL_STEP_NUMBER) {
      setGenerative(false);
      dispatch({ type: FormActions.RESET_TYPE_OF_ART, payload: {} });
    }
  }, [stepNumber]);
  const IS_LAST_STEP =
    stepNumber === (generative ? GEN_STEPS - 1 : STATIC_STEPS - 1);
  const handleNextStep = () => setStepNumber((prev) => prev + 1);
  const handlePrevStep = () => setStepNumber((prev) => prev - 1);
  const closeAlert = () => setAlertMessage("");

  const showFormAlert = (severity: AlertColor, message: string) => {
    showAlert(setAlertSeverity, severity, setAlertMessage, message);
    setTimeout(closeAlert, DEFAULT_ALERT_DURATION);
  };

  const handleLayerProbChange = (layerName: string) => (e: InputEventT) => {
    dispatch({
      type: FormActions.CHANGE_LAYER_PROBABILITY,
      payload: {
        layerProbabilityChange: { layerName, newProbability: e.target.value },
      },
    });
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
          handleNextStep,
          newCollName,
          library,
          setTxAddress
        )
      }
      component="form"
      justifyContent="center"
      spacing={2}
      data-testid="create-form">
      <GeneralInfoStep
        handleTwitterChange={(e) => handleTwitterChange(e, dispatch)}
        handleRedditChange={(e) => handleRedditChange(e, dispatch)}
        generative={generative}
        stepNumber={stepNumber}
        state={state}
        handleCollNameChange={(e) => handleCollNameChange(e, dispatch)}
        handleDescriptionChange={(e) => handleDescriptionChange(e, dispatch)}
        handleMintPriceChange={(e) => handleMintPriceChange(e, dispatch)}
        handleSymbolChange={(e) => handleSymbolChange(e, dispatch)}
      />
      <TypeOfArtStep
        handleNextStep={handleNextStep}
        setGenerative={setGenerative}
        stepNumber={stepNumber}
      />
      <StaticArtStep
        generative={generative}
        stepNumber={stepNumber}
        state={state}
        isLoading={isLoading}
        handleImgDrop={(e) => handleImageDrop(e, dispatch, generative)}
        handleImgDelete={(deleteId) =>
          handleImageDelete(deleteId, dispatch, generative)
        }
        handleImgNameChange={(e) =>
          handleImgNameChange(e, dispatch, generative)
        }
        handleImgDescChange={(e) => handleImgDescChange(e, dispatch)}
      />
      <TierSelectionStep
        handleTierAdd={(e) => handleTierAdd(e, dispatch)}
        handleTierRemoval={(e) => handleTierRemoval(e, dispatch)}
        handleTierReorder={(e) => handleTierReorder(e, dispatch)}
        state={state}
        stepNumber={stepNumber}
        generative={generative}
        handleTierProbChange={(tierName) =>
          handleTierProbChange(tierName, dispatch)
        }
      />
      <LayerSelectionStep
        handleLayerRemoval={(layerName) =>
          handleLayerRemoval(layerName, dispatch)
        }
        handleLayerReorder={(layerName) =>
          handleLayerReorder(layerName, dispatch)
        }
        generative={generative}
        stepNumber={stepNumber}
        state={state}
        handleLayerAddition={(newLayerName) =>
          handleLayerAddition(newLayerName, dispatch)
        }
        handleLayerProbChange={handleLayerProbChange}
      />
      <LayerImageUpload
        handleImgRarityChange={handleImgRarityChange(dispatch)}
        isLoading={isLoading}
        state={state}
        generative={generative}
        handleLayerImgDrop={(e) => handleImageDrop(e, dispatch, generative)}
        handleLayerImgDelete={(deleteId) =>
          handleImageDelete(deleteId, dispatch, generative)
        }
        handleLayerImgNameChange={(e) =>
          handleImgNameChange(e, dispatch, generative)
        }
        handleQuantityChange={(e) => handleQuantityChange(e, dispatch)}
        stepNumber={stepNumber}
      />
      <RecommendationsStep
        generative={generative}
        stepNumber={stepNumber}
        state={state}
        handleChangeCollName={setNewCollName}
        changedCollName={newCollName}
      />
      <Box sx={formFooterStyle}>
        <FormAlert
          closeAlert={closeAlert}
          alertMessage={alertMessage}
          alertSeverity={alertSeverity}
        />
        <FormButtons
          isLoading={isLoading}
          loadingMessage={loadingMessage}
          handlePrevStep={handlePrevStep}
          isLastStep={IS_LAST_STEP}
          stepNumber={stepNumber}
        />
      </Box>
    </Stack>
  );
};
export default CreateCollectionForm;
