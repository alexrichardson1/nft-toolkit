import CloseIcon from "@mui/icons-material/Close";
import { Alert, AlertColor, Collapse, IconButton, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import { SxProps } from "@mui/system";
import { useWeb3React } from "@web3-react/core";
import SnackbarContext from "context/snackbar/SnackbarContext";
import { FormEvent, useContext, useEffect, useReducer, useState } from "react";
import { Redirect } from "react-router";
import formReducer from "reducers/formReducer";
import {
  DEFAULT_ALERT_DURATION,
  DEFAULT_ALERT_ELEVATION,
} from "utils/constants";
import showAlert from "utils/showAlert";
import GenArtOrdering from "./form-steps/GenArtOrdering";
import GenArtStep from "./form-steps/GenArtStep";
import GeneralInfoStep from "./form-steps/GeneralInfoStep";
import StaticArtStep from "./form-steps/StaticArtStep";
import TypeOfArtStep from "./form-steps/TypeOfArtStep";
import FormButtons from "./FormButtons";
import {
  addDeployedAddress,
  startLoading,
  stopLoading,
  uploadCollection,
  uploadImages,
} from "./formUtils";

const INITIAL_STATE = {
  collectionName: "",
  description: "",
  symbol: "",
  images: [],
  mintingPrice: 0,
};

const alertContainerStyle = { flexGrow: 1 };
const formFooterStyle: SxProps = {
  display: "flex",
  gap: "10px",
  minHeight: 50,
  flexDirection: { xs: "column", sm: "row" },
};

const INITIAL_PAGE_NUMBER = 0;
const STATIC_PAGES = 3;
const GEN_PAGES = 4;

const CreateCollectionForm = (): JSX.Element => {
  const [pageNumber, setPageNumber] = useState(INITIAL_PAGE_NUMBER);
  const { active, account, chainId, library } = useWeb3React();
  const { showSnackbar } = useContext(SnackbarContext);
  const [state, dispatch] = useReducer(formReducer, INITIAL_STATE);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState<AlertColor>("success");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [generative, setGenerative] = useState(false);
  const [success, setSuccess] = useState(false);

  const IS_LAST_PAGE =
    pageNumber === (generative ? GEN_PAGES - 1 : STATIC_PAGES - 1);

  const handleNextPage = () => setPageNumber((prev) => prev + 1);
  const handlePrevPage = () => setPageNumber((prev) => prev - 1);

  const closeAlert = () => setAlertMessage("");

  const handleSymbolChange = (e: InputEventT) =>
    dispatch({
      type: "CHANGE_SYMBOL",
      payload: { symbol: e.target.value },
    });

  const handleImageDelete = (deleteId: string) => {
    dispatch({ type: "DELETE_IMAGE", payload: { deleteId } });
  };

  const handleImgNameChange = (e: InputEventT, id: string) =>
    dispatch({
      type: "CHANGE_IMAGE_NAME",
      payload: { newImgObj: { newImageName: e.target.value, imageId: id } },
    });

  const handleImageDrop = (
    e: React.DragEvent<HTMLLabelElement> | React.ChangeEvent<HTMLInputElement>,
    imgObjs: FileList | null
  ) => {
    e.preventDefault();
    dispatch({
      type: "CHANGE_IMAGES",
      payload: { images: Array.from(imgObjs ?? []) },
    });
  };

  const handleCollNameChange = (e: InputEventT) =>
    dispatch({ type: "CHANGE_NAME", payload: { newName: e.target.value } });

  const handleDescriptionChange = (e: InputEventT) =>
    dispatch({
      type: "CHANGE_DESCRIPTION",
      payload: { description: e.target.value },
    });

  const handleMintPriceChange = (e: InputEventT) =>
    dispatch({ type: "CHANGE_PRICE", payload: { price: e.target.value } });

  const showFormAlert = (severity: AlertColor, message: string) => {
    showAlert(setAlertSeverity, severity, setAlertMessage, message);
    setTimeout(closeAlert, DEFAULT_ALERT_DURATION);
  };

  useEffect(() => {
    if (pageNumber <= 1) {
      setGenerative(false);
    }
  }, [pageNumber]);

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!IS_LAST_PAGE) {
      handleNextPage();
      return;
    }

    if (!active || !account || !chainId) {
      showSnackbar("warning", "Please connect your wallet first!");
      return;
    }

    startLoading(setLoadingMessage, setIsLoading, "Uploading...");

    try {
      await uploadImages(state.images, account, state.collectionName);
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

  const alertBox = (
    <Collapse sx={alertContainerStyle} in={alertMessage.length !== 0}>
      <Alert
        elevation={DEFAULT_ALERT_ELEVATION}
        variant="filled"
        data-testid="form-alert"
        severity={alertSeverity}
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={closeAlert}>
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }>
        {alertMessage}
      </Alert>
    </Collapse>
  );

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
        pageNumber={pageNumber}
        state={state}
        handleCollNameChange={handleCollNameChange}
        handleDescriptionChange={handleDescriptionChange}
        handleMintPriceChange={handleMintPriceChange}
        handleSymbolChange={handleSymbolChange}
      />
      <TypeOfArtStep
        handleNextPage={handleNextPage}
        setGenerative={setGenerative}
        pageNumber={pageNumber}
      />
      <StaticArtStep
        generative={generative}
        pageNumber={pageNumber}
        state={state}
        isLoading={isLoading}
        handleImageDrop={handleImageDrop}
        handleImageDelete={handleImageDelete}
        handleImgNameChange={handleImgNameChange}
      />
      <GenArtOrdering
        generative={generative}
        pageNumber={pageNumber}
        state={state}
      />
      <GenArtStep
        generative={generative}
        pageNumber={pageNumber}
        state={state}
      />
      <Box sx={formFooterStyle}>
        {alertBox}
        <FormButtons
          isLoading={isLoading}
          loadingMessage={loadingMessage}
          handlePrevPage={handlePrevPage}
          isLastPage={IS_LAST_PAGE}
          pageNumber={pageNumber}
        />
      </Box>
    </Stack>
  );
};

export default CreateCollectionForm;
