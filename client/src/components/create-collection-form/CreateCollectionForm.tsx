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
import GenArtStep from "./form-steps/GenArtStep";
import GeneralInfoStep from "./form-steps/GeneralInfoStep";
import LayerSelectionStep from "./form-steps/LayerSelectionStep";
import StaticArtStep from "./form-steps/StaticArtStep";
import TypeOfArtStep from "./form-steps/TypeOfArtStep";
import FormAlert from "./FormAlert";
import FormButtons from "./FormButtons";

const INITIAL_STEP_NUMBER = 0;
const STATIC_STEP = 3;
const GEN_STEPS = 4;
const INITIAL_STATE: FormStateI = {
  collectionName: "",
  description: "",
  symbol: "",
  mintingPrice: 0,
  static: { images: {}, numberOfImages: 0 },
  generative: { layers: [], numberOfLayers: 0 },
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
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (stepNumber <= 1) {
      setGenerative(false);
      dispatch({ type: FormActions.RESET_TYPE_OF_ART, payload: {} });
    }
  }, [stepNumber]);

  const IS_LAST_PAGE =
    stepNumber === (generative ? GEN_STEPS - 1 : STATIC_STEP - 1);

  const handleNextStep = () => setStepNumber((prev) => prev + 1);
  const handlePrevStep = () => setStepNumber((prev) => prev - 1);
  const closeAlert = () => setAlertMessage("");

  const handleImageDelete = (deleteId: string) => {
    dispatch({ type: FormActions.DELETE_IMAGE, payload: { deleteId } });
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
      type: FormActions.CHANGE_PRECEDENCE,
      payload: { dragEndEvent: e },
    });
  };

  const handleLayerRemoval = (layerId: string) => {
    dispatch({
      type: FormActions.REMOVE_LAYER,
      payload: { deleteLayerId: layerId },
    });
  };
  const handleSymbolChange = (e: InputEventT) =>
    dispatch({
      type: FormActions.CHANGE_SYMBOL,
      payload: { symbol: e.target.value },
    });

  const handleImgNameChange = (e: InputEventT, id: string) =>
    dispatch({
      type: FormActions.CHANGE_IMAGE_NAME,
      payload: { modifyImgObj: { newImageName: e.target.value, imageId: id } },
    });

  const handleImageDrop = (
    e: React.DragEvent<HTMLLabelElement> | React.ChangeEvent<HTMLInputElement>,
    imgObjs: FileList | null
  ) => {
    e.preventDefault();
    if (!imgObjs) {
      return;
    }
    dispatch({
      type: FormActions.CHANGE_IMAGES,
      payload: { newImagesStatic: Array.from(imgObjs) },
    });
  };

  const handleDescriptionChange = (e: InputEventT) =>
    dispatch({
      type: FormActions.CHANGE_DESCRIPTION,
      payload: { description: e.target.value },
    });

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!IS_LAST_PAGE) {
      handleNextStep();
      return;
    }
    if (!active || !account || !chainId) {
      showSnackbar("warning", "Please connect your wallet first!");
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
      addDeployedAddress(
        account,
        state.collectionName,
        txReceipt.contractAddress
      );
      showFormAlert("success", "Collection Creation Successful");
      stopLoading(setLoadingMessage, setIsLoading);
      setSuccess(true);
    } catch (error) {
      console.error(error);
      stopLoading(setLoadingMessage, setIsLoading);
      showFormAlert("error", "Unable to create collection");
    }
  };

  if (success) {
    return <Redirect to={`/${account}/${state.collectionName}`} />;
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
      />
      <LayerSelectionStep
        handleLayerRemoval={handleLayerRemoval}
        handleLayerReorder={handleLayerReorder}
        generative={generative}
        stepNumber={stepNumber}
        state={state}
        handleLayerAddition={handleLayerAddition}
      />
      <GenArtStep
        generative={generative}
        stepNumber={stepNumber}
        state={state}
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
          handlePrevPage={handlePrevStep}
          isLastPage={IS_LAST_PAGE}
          pageNumber={stepNumber}
        />
      </Box>
    </Stack>
  );
};

export default CreateCollectionForm;
