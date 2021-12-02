import { TransactionRequest, Web3Provider } from "@ethersproject/providers";
import { AlertColor } from "@mui/material";
import FormActions from "actions/formActions";
import { Deferrable } from "ethers/lib/utils";
import { FormEvent } from "react";
import { FormActionI } from "reducers/formReducerTypes";
import {
  addDeployedAddress,
  startLoading,
  stopLoading,
  uploadCollection,
  uploadGenCollection,
  uploadGenImages,
  uploadImages,
} from "utils/formUtils";
import { handlePredictionsChange } from "./predictionHandles";

export const inputDispatch = (
  e: InputEventT,
  dispatch: React.Dispatch<FormActionI>,
  type: FormActions,
  property: string
): void => {
  dispatch({
    type,
    payload: { [property]: e.target.value },
  });
};

// steps
const TIER_UPLOAD_STEP = 1;
const LAYER_SELECTION_STEP = 2;
const LAYER_IMG_UPLOAD_STEP = 3;
const PAGE_IDX_OFFSET = 2;
export const STATIC_STEPS = 4;
export const GEN_STEPS = 6;

const DUMMY_ML_DATA = {
  names: [{ name: "name1", distance: 3 }],
  hype: 2,
};

const isGeneralInfoStep = (generative: boolean, stepNumber: number) => {
  return (
    (generative && stepNumber === GEN_STEPS - PAGE_IDX_OFFSET) ||
    (!generative && stepNumber === STATIC_STEPS - PAGE_IDX_OFFSET)
  );
};

const checkRarities = (
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

const checkChance = (
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

const handleIfNotLastStep = async (
  dispatch: React.Dispatch<FormActionI>,
  isLastStep: boolean,
  generative: boolean,
  stepNumber: number,
  state: FormStateI,
  showFormAlert: (severity: AlertColor, message: string) => void,
  setLoadingMessage: SetStateAction<string>,
  setIsLoading: SetStateAction<boolean>,
  setNewCollName: SetStateAction<string>,
  handleNextStep: () => void
): Promise<boolean> => {
  if (isLastStep) {
    return true;
  }
  if (
    generative &&
    stepNumber === LAYER_SELECTION_STEP &&
    state.generative.numberOfLayers <= 0
  ) {
    showFormAlert("warning", "You need atleast one layer to proceed.");
    return false;
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
    return false;
  }
  if (isGeneralInfoStep(generative, stepNumber)) {
    startLoading(setLoadingMessage, setIsLoading, "Getting Predictions");
    const DUMMY_WAIT_TIME = 5000;
    await new Promise((resolve) => setTimeout(resolve, DUMMY_WAIT_TIME));
    handlePredictionsChange(DUMMY_ML_DATA, dispatch);
    stopLoading(setLoadingMessage, setIsLoading);
    setNewCollName(state.collectionName);
  }
  handleNextStep();
  return true;
};

const handleLastStep = async (
  setLoadingMessage: SetStateAction<string>,
  setIsLoading: SetStateAction<boolean>,
  state: FormStateI,
  newCollName: string,
  generative: boolean,
  account: string,
  chainId: number,
  library: Web3Provider,
  showFormAlert: (severity: AlertColor, message: string) => void,
  setTxAddress: SetStateAction<string>
) => {
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
};

export const handleFormSubmit = async (
  e: FormEvent,
  active: boolean,
  account: string | null | undefined,
  chainId: number | undefined,
  showSnackbar: (type: AlertColor, message: string) => void,
  isLastStep: boolean,
  generative: boolean,
  stepNumber: number,
  state: FormStateI,
  showFormAlert: (severity: AlertColor, message: string) => void,
  setLoadingMessage: SetStateAction<string>,
  setIsLoading: SetStateAction<boolean>,
  dispatch: React.Dispatch<FormActionI>,
  setNewCollName: SetStateAction<string>,
  handleNextStep: () => void,
  newCollName: string,
  library: Web3Provider,
  setTxAddress: SetStateAction<string>
): Promise<void> => {
  e.preventDefault();
  if (!active || !account || !chainId) {
    showSnackbar("warning", "Please connect your wallet first!");
    return;
  }
  if (
    !(await handleIfNotLastStep(
      dispatch,
      isLastStep,
      generative,
      stepNumber,
      state,
      showFormAlert,
      setLoadingMessage,
      setIsLoading,
      setNewCollName,
      handleNextStep
    ))
  ) {
    return;
  }
  try {
    await handleLastStep(
      setLoadingMessage,
      setIsLoading,
      state,
      newCollName,
      generative,
      account,
      chainId,
      library,
      showFormAlert,
      setTxAddress
    );
  } catch {
    stopLoading(setLoadingMessage, setIsLoading);
    showFormAlert("error", "Unable to create collection");
  }
};
