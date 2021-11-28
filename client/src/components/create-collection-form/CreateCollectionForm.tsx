import { DragEndEvent } from "@dnd-kit/core";
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
import {
  addDeployedAddress,
  startLoading,
  stopLoading,
  uploadCollection,
  uploadImages,
} from "../../utils/formUtils";
import GeneralInfoStep from "./form-steps/GeneralInfoStep";
import LayerImageUpload from "./form-steps/LayerImageUpload";
import LayerSelectionStep from "./form-steps/LayerSelectionStep";
import StaticArtStep from "./form-steps/StaticArtStep";
import TierSelectionStep from "./form-steps/TierSelectionStep";
import TypeOfArtStep from "./form-steps/TypeOfArtStep";
import FormAlert from "./FormAlert";
import FormButtons from "./FormButtons";

const INITIAL_STEP_NUMBER = 0;
const STATIC_STEP = 3;
const GEN_STEPS = 5;
const INITIAL_STATE: FormStateI = {
  collectionName: "",
  description: "",
  symbol: "",
  mintingPrice: "",
  static: { images: {}, numberOfImages: 0 },
  generative: { numberOfTiers: 0, tiers: [], layers: [], numberOfLayers: 0 },
};

const formFooterStyle: SxProps = {
  display: "flex",
  gap: "10px",
  minHeight: 50,
  flexDirection: { xs: "column", sm: "row" },
};

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
  if (totalRarity !== 1) {
    showFormAlert(
      "warning",
      `All your rarities should add up to 1 for layer ${layer.name}`
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

export const uploadGenImages = (
  state: FormStateI,
  showFormAlert: (severity: AlertColor, message: string) => void
): void => {
  for (const layer of state.generative.layers) {
    if (!checkRarities(layer, showFormAlert)) {
      return;
    }
  }
  // TODO: Add logic for generative uploads here
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

  useEffect(() => {
    if (stepNumber <= 1) {
      setGenerative(false);
      dispatch({ type: FormActions.RESET_TYPE_OF_ART, payload: {} });
    }
  }, [stepNumber]);

  const IS_LAST_STEP =
    stepNumber === (generative ? GEN_STEPS - 1 : STATIC_STEP - 1);

  const handleNextStep = () => setStepNumber((prev) => prev + 1);
  const handlePrevStep = () => setStepNumber((prev) => prev - 1);
  const closeAlert = () => setAlertMessage("");

  const handleImageDelete = (deleteId: string, layerName = "") => {
    let payload;

    if (generative) {
      payload = { deleteGen: { deleteId, layerName } };
    } else {
      payload = { deleteId };
    }

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
    let payload;
    if (generative) {
      payload = {
        modifyImgObjGen: {
          newImageName: e.target.value,
          imageId: imageid,
          layerName,
        },
      };
    } else {
      payload = {
        modifyImgObjStatic: { newImageName: e.target.value, imageId: imageid },
      };
    }
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
    let payload;
    if (generative) {
      payload = { newImagesGen: { images: Array.from(imgObjs), layerName } };
    } else {
      payload = { newImagesStatic: Array.from(imgObjs) };
    }
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

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!active || !account || !chainId) {
      showSnackbar("warning", "Please connect your wallet first!");
      return;
    }

    if (!IS_LAST_STEP) {
      const TIER_UPLOAD_PAGE = 2;
      const LAYER_SELECTION_PAGE = 3;
      if (
        stepNumber === LAYER_SELECTION_PAGE &&
        state.generative.numberOfLayers <= 0
      ) {
        showFormAlert("warning", "You need atleast one layer to proceed.");
        return;
      }
      if (
        stepNumber === TIER_UPLOAD_PAGE &&
        !checkChance(
          state.generative.numberOfTiers,
          state.generative.tiers,
          showFormAlert
        )
      ) {
        return;
      }
      handleNextStep();
      return;
    }

    if (generative) {
      uploadGenImages(state, showFormAlert);
      return;
    }

    try {
      startLoading(setLoadingMessage, setIsLoading, "Uploading...");
      await uploadImages(
        Object.values(state.static.images),
        account,
        state.collectionName
      );
      setLoadingMessage("Saving...");
      const tx = await uploadCollection(state, account, chainId);
      const signer = library.getSigner();
      setLoadingMessage("Deploying...");
      const txResponse = await signer.sendTransaction(tx);
      setLoadingMessage("Confirming...");
      const txReceipt = await txResponse.wait();
      addDeployedAddress(account, chainId, txReceipt.contractAddress);
      showFormAlert("success", "Collection Creation Successful");
      stopLoading(setLoadingMessage, setIsLoading);
      setTxAddress(txReceipt.contractAddress);
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
        stepNumber={stepNumber}
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
