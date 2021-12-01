import { DragEndEvent } from "@dnd-kit/core";
import { TransactionRequest, Web3Provider } from "@ethersproject/providers";
import { AlertColor, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import { SxProps } from "@mui/system";
import { useWeb3React } from "@web3-react/core";
import FormActions from "actions/formActions";
import SnackbarContext from "context/snackbar/SnackbarContext";
import { Deferrable } from "ethers/lib/utils";
import { FormEvent, useContext, useEffect, useReducer, useState } from "react";
import { Redirect } from "react-router-dom";
import formReducer from "reducers/formReducer";
import { DEFAULT_ALERT_DURATION } from "utils/constants";
import {
  addDeployedAddress,
  startLoading,
  stopLoading,
  uploadCollection,
  uploadGenCollection,
  uploadGenImages,
  uploadImages,
} from "utils/formUtils";
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

const DUMMY_ML_DATA = {
  names: [
    { name: "name1", distance: 3 },
    { name: "name2", distance: 4 },
    { name: "name3", distance: 5 },
  ],
  hype: 2,
};

const INITIAL_STEP_NUMBER = 0;
const STATIC_STEPS = 4;
const GEN_STEPS = 6;
const PAGE_IDX_OFFSET = 2;
// handleFormSubmit
const TIER_UPLOAD_STEP = 1;
const LAYER_SELECTION_STEP = 2;
const LAYER_IMG_UPLOAD_STEP = 3;

const INITIAL_STATE: FormStateI = {
  collectionName: "",
  description: "",
  symbol: "",
  mintingPrice: "",
  static: { images: {}, numberOfImages: 0 },
  generative: {
    numberOfTiers: 0,
    tiers: [],
    layers: [],
    numberOfLayers: 0,
    quantity: "",
  },
  predictions: { names: [], hype: -1 },
};

const formFooterStyle: SxProps = {
  display: "flex",
  gap: "10px",
  minHeight: 50,
  flexDirection: { xs: "column", sm: "row" },
};

const isGeneralInfoStep = (stepNumber: number) =>
  stepNumber === GEN_STEPS - PAGE_IDX_OFFSET ||
  stepNumber === STATIC_STEPS - PAGE_IDX_OFFSET;

export const checkRarities = (
  layer: LayerI,
  showFormAlert: (severity: AlertColor, message: string) => void
): boolean => {
  let totalRarity = 0;
  for (const imageId in layer.images) {
    const image = layer.images[imageId];
    if (!image || !image.rarity) {
      showFormAlert(
        "warning",
        `Please type in a rarity for image ${image?.name} in layer ${layer.name}`
      );
      return false;
    }
    totalRarity += Number(image.rarity);
  }
  const maxRarity = 100;
  if (totalRarity !== maxRarity) {
    showFormAlert(
      "warning",
      `All your rarities should add up to 100 for layer ${layer.name}`
    );
    return false;
  }
  return true;
};

export const checkChance = (
  numberOfTiers: number,
  tiers: TierI[],
  showFormAlert: (severity: AlertColor, message: string) => void
): boolean => {
  if (numberOfTiers <= 0) {
    showFormAlert("warning", "You need atleast one Tier to proceed.");
    return false;
  }
  const REQUIRED_CHANCE = 100;
  let totalChance = 0;
  for (const tier of tiers) {
    totalChance += Number(tier.probability);
  }
  if (totalChance !== REQUIRED_CHANCE) {
    showFormAlert(
      "warning",
      `All your Tiers should add up to ${REQUIRED_CHANCE}`
    );
    return false;
  }
  return true;
};

const checkLayers = (
  layers: LayerI[],
  showFormAlert: (severity: AlertColor, message: string) => void
): boolean => {
  return layers.every((layer) => checkRarities(layer, showFormAlert));
};

const createCollection = async (
  library: Web3Provider,
  setLoadingMessage: SetStateAction<string>,
  tx: Deferrable<TransactionRequest>,
  account: string,
  chainId: number,
  showFormAlert: (severity: AlertColor, message: string) => void,
  setIsLoading: SetStateAction<boolean>,
  setTxAddress: SetStateAction<string>
) => {
  const signer = library.getSigner();
  setLoadingMessage("Deploying...");
  const txResponse = await signer.sendTransaction(tx);
  setLoadingMessage("Confirming...");
  const txReceipt = await txResponse.wait();
  addDeployedAddress(account, chainId, txReceipt.contractAddress);
  showFormAlert("success", "Collection Creation Successful");
  stopLoading(setLoadingMessage, setIsLoading);
  setTxAddress(txReceipt.contractAddress);
};

// eslint-disable-next-line max-lines-per-function
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
  const handleImageDelete = (deleteId: string, layerName = "") => {
    const payload = generative
      ? { deleteGen: { deleteId, layerName } }
      : { deleteId };
    dispatch({
      type: generative
        ? FormActions.DELETE_IMAGE_GEN
        : FormActions.DELETE_IMAGE_STATIC,
      payload,
    });
  };
  const handleImgDescChange = (e: InputEventT, imageId: string) => {
    dispatch({
      type: FormActions.CHANGE_IMAGE_DESC,
      payload: { imageDescChange: { imageId, newDesc: e.target.value } },
    });
  };
  const handleCollNameChange = (e: InputEventT) =>
    dispatch({
      type: FormActions.CHANGE_NAME,
      payload: { newName: e.target.value },
    });
  const handleMintPriceChange = (e: InputEventT) =>
    dispatch({
      type: FormActions.CHANGE_PRICE,
      payload: { price: e.target.value },
    });
  const showFormAlert = (severity: AlertColor, message: string) => {
    showAlert(setAlertSeverity, severity, setAlertMessage, message);
    setTimeout(closeAlert, DEFAULT_ALERT_DURATION);
  };
  const handleLayerAddition = (newLayerName: string) => {
    dispatch({
      type: FormActions.ADD_LAYER,
      payload: { newLayer: { name: newLayerName } },
    });
  };
  const handleLayerReorder = (e: DragEndEvent) => {
    dispatch({
      type: FormActions.CHANGE_LAYER_PRECEDENCE,
      payload: { dragEndEvent: e },
    });
  };
  const handleTierRemoval = (tierName: string) => {
    dispatch({
      type: FormActions.REMOVE_TIER,
      payload: { deleteTierName: tierName },
    });
  };
  const handleTierAdd = (newTierName: string) => {
    dispatch({
      type: FormActions.ADD_TIER,
      payload: { newTier: { name: newTierName } },
    });
  };
  const handleTierProbChange = (tierName: string) => (e: InputEventT) => {
    dispatch({
      type: FormActions.CHANGE_TIER_PROBABILITY,
      payload: {
        tierProbabilityChange: { tierName, newProbability: e.target.value },
      },
    });
  };
  const handleTierReorder = (e: DragEndEvent) => {
    dispatch({
      type: FormActions.CHANGE_TIER_PRECEDENCE,
      payload: { dragEndEvent: e },
    });
  };
  const handleLayerRemoval = (layerName: string) => {
    dispatch({
      type: FormActions.REMOVE_LAYER,
      payload: { deleteLayerName: layerName },
    });
  };
  const handleSymbolChange = (e: InputEventT) =>
    dispatch({
      type: FormActions.CHANGE_SYMBOL,
      payload: { symbol: e.target.value },
    });
  const handleImgNameChange = (
    e: InputEventT,
    imageid: string,
    layerName = ""
  ) => {
    const payload = generative
      ? {
          modifyImgObjGen: {
            newImageName: e.target.value,
            imageId: imageid,
            layerName,
          },
        }
      : {
          modifyImgObjStatic: {
            newImageName: e.target.value,
            imageId: imageid,
          },
        };
    dispatch({
      type: generative
        ? FormActions.CHANGE_IMAGE_NAME_GEN
        : FormActions.CHANGE_IMAGE_NAME,
      payload,
    });
  };
  const handleImageDrop = (
    e: React.DragEvent<HTMLLabelElement> | React.ChangeEvent<HTMLInputElement>,
    imgObjs: FileList | null,
    layerName = ""
  ) => {
    e.preventDefault();
    if (!imgObjs) {
      return;
    }
    const payload = generative
      ? { newImagesGen: { images: Array.from(imgObjs), layerName } }
      : { newImagesStatic: Array.from(imgObjs) };
    dispatch({
      type: generative
        ? FormActions.ADD_IMAGES_GEN
        : FormActions.ADD_IMAGES_STATIC,
      payload,
    });
  };
  const handleImgRarityChange =
    (layerName: string) => (e: InputEventT, imageId: string) =>
      dispatch({
        type: FormActions.CHANGE_RARITY,
        payload: {
          rarityChange: { newRarity: e.target.value, imageId, layerName },
        },
      });
  const handleDescriptionChange = (e: InputEventT) =>
    dispatch({
      type: FormActions.CHANGE_DESCRIPTION,
      payload: { description: e.target.value },
    });
  const handleQuantityChange = (e: InputEventT) =>
    dispatch({
      type: FormActions.CHANGE_QUANTITY,
      payload: { quantity: e.target.value },
    });
  const handlePredictionsChange = (newPredictions: MlDataI) =>
    dispatch({
      type: FormActions.CHANGE_PREDICTIONS,
      payload: { newPredictions },
    });
  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!active || !account || !chainId) {
      showSnackbar("warning", "Please connect your wallet first!");
      return;
    }
    if (!IS_LAST_STEP) {
      if (
        generative &&
        stepNumber === LAYER_SELECTION_STEP &&
        state.generative.numberOfLayers <= 0
      ) {
        showFormAlert("warning", "You need atleast one layer to proceed.");
        return;
      }

      if (
        generative &&
        ((stepNumber === TIER_UPLOAD_STEP &&
          !checkChance(
            state.generative.numberOfTiers,
            state.generative.tiers,
            showFormAlert
          )) ||
          (stepNumber === LAYER_IMG_UPLOAD_STEP &&
            !checkLayers(state.generative.layers, showFormAlert)))
      ) {
        return;
      }
      if (isGeneralInfoStep(stepNumber)) {
        startLoading(setLoadingMessage, setIsLoading, "Getting Predictions");
        const DUMMY_WAIT_TIME = 5000;
        // Get the data here
        await new Promise((resolve) => setTimeout(resolve, DUMMY_WAIT_TIME));
        handlePredictionsChange(DUMMY_ML_DATA);
        stopLoading(setLoadingMessage, setIsLoading);
        setNewCollName(state.collectionName);
      }
      handleNextStep();
      return;
    }

    try {
      startLoading(setLoadingMessage, setIsLoading, "Uploading...");
      let tx: Deferrable<TransactionRequest>;
      const modifiedState = { ...state, collectionName: newCollName };
      if (generative) {
        const layers = await uploadGenImages(
          state.generative.layers,
          account,
          newCollName
        );
        setLoadingMessage("Generating...");
        tx = await uploadGenCollection(layers, modifiedState, account, chainId);
      } else {
        await uploadImages(
          Object.values(state.static.images),
          account,
          newCollName
        );
        setLoadingMessage("Saving...");
        tx = await uploadCollection(modifiedState, account, chainId);
      }

      await createCollection(
        library,
        setLoadingMessage,
        tx,
        account,
        chainId,
        showFormAlert,
        setIsLoading,
        setTxAddress
      );
    } catch (error) {
      console.error(error);
      stopLoading(setLoadingMessage, setIsLoading);
      showFormAlert("error", "Unable to create collection");
    }
  };

  if (txAddress !== "") {
    return <Redirect to={`/${chainId}/${txAddress}`} />;
  }

  return (
    <Stack
      onSubmit={handleFormSubmit}
      component="form"
      justifyContent="center"
      spacing={2}
      data-testid="create-form">
      <GeneralInfoStep
        generative={generative}
        stepNumber={stepNumber}
        state={state}
        handleCollNameChange={handleCollNameChange}
        handleDescriptionChange={handleDescriptionChange}
        handleMintPriceChange={handleMintPriceChange}
        handleSymbolChange={handleSymbolChange}
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
        handleImgDrop={handleImageDrop}
        handleImgDelete={handleImageDelete}
        handleImgNameChange={handleImgNameChange}
        handleImgDescChange={handleImgDescChange}
      />
      <TierSelectionStep
        handleTierAdd={handleTierAdd}
        handleTierRemoval={handleTierRemoval}
        handleTierReorder={handleTierReorder}
        state={state}
        stepNumber={stepNumber}
        generative={generative}
        handleTierProbChange={handleTierProbChange}
      />
      <LayerSelectionStep
        handleLayerRemoval={handleLayerRemoval}
        handleLayerReorder={handleLayerReorder}
        generative={generative}
        stepNumber={stepNumber}
        state={state}
        handleLayerAddition={handleLayerAddition}
      />
      <LayerImageUpload
        handleImgRarityChange={handleImgRarityChange}
        isLoading={isLoading}
        state={state}
        generative={generative}
        handleLayerImgDrop={handleImageDrop}
        handleLayerImgDelete={handleImageDelete}
        handleLayerImgNameChange={handleImgNameChange}
        handleQuantityChange={handleQuantityChange}
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
