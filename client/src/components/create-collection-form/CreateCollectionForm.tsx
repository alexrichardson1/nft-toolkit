import ClearIcon from "@mui/icons-material/Clear";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import LoadingButton from "@mui/lab/LoadingButton";
import { Alert, AlertColor, Collapse, IconButton, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { SxProps } from "@mui/system";
import { FormEvent, useReducer, useState } from "react";
import formReducer from "reducers/formReducer";
import {
  DEFAULT_ALERT_DURATION,
  DEFAULT_ALERT_ELEVATION,
} from "utils/constants";
import showAlert from "utils/showAlert";
import GeneralInfoStep from "./form-steps/GeneralInfoStep";
import StaticArtStep from "./form-steps/StaticArtStep";
import TypeOfArtStep from "./form-steps/TypeOfArtStep";
import { startLoading, stopLoading } from "./formUtils";

const NUMBER_OF_PAGES = 2;
const INITIAL_STATE = {
  collectionName: "",
  description: "",
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
const buttonsWrapperStyle = {
  justifyContent: "flex-end",
  display: "flex",
  gap: "10px",
};
const loadingButtonStyle = {
  "&.Mui-disabled": {
    bgcolor: "secondary.main",
    color: "white",
  },
};

const INITIAL_PAGE_NUMBER = 0;

const getButtonText = (
  isLoading: boolean,
  isLastPage: boolean,
  loadingMessage: string
) => {
  if (isLoading) {
    return loadingMessage;
  }
  if (isLastPage) {
    return "Submit";
  }
  return "Next";
};

const PAGE_1 = 1;
const PAGE_2 = 2;
const CreateCollectionForm = (): JSX.Element => {
  const [pageNumber, setPageNumber] = useState(INITIAL_PAGE_NUMBER);
  const [state, dispatch] = useReducer(formReducer, INITIAL_STATE);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState<AlertColor>("success");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  const IS_LAST_PAGE = pageNumber === NUMBER_OF_PAGES - 1;

  const handleNextPage = () => setPageNumber((prev) => prev + 1);
  const handlePrevPage = () => setPageNumber((prev) => prev - 1);

  const closeAlert = () => setAlertMessage("");

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

  // const handleStateReset = () => {
  //   dispatch({ type: "RESET_STATE", payload: { initialState: INITIAL_STATE } });
  //   showFormAlert("info", "Form has been reset");
  // };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!IS_LAST_PAGE) {
      handleNextPage();
      return;
    }
    console.log(state);
    startLoading(setLoadingMessage, setIsLoading, "Uploading...");
    const UPLOADING_DURATION = 3000;
    setTimeout(() => setLoadingMessage("Saving..."), UPLOADING_DURATION);
    const SAVING_DURATION = 3000;
    setTimeout(
      () => setLoadingMessage("Deploying..."),
      UPLOADING_DURATION + SAVING_DURATION
    );
    const DEPLOYING_DURATION = 3000;
    setTimeout(() => {
      stopLoading(setLoadingMessage, setIsLoading);
      showFormAlert("success", "Minting Successful");
    }, UPLOADING_DURATION + SAVING_DURATION + DEPLOYING_DURATION);
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

  const formButtons = (
    <Box sx={buttonsWrapperStyle}>
      <Button
        startIcon={<ClearIcon />}
        data-testid="reset"
        disabled={isLoading || pageNumber === INITIAL_PAGE_NUMBER}
        color="error"
        size="large"
        variant="contained"
        type="reset"
        onClick={handlePrevPage}>
        Back
      </Button>
      <LoadingButton
        sx={loadingButtonStyle}
        loading={isLoading}
        loadingPosition="end"
        type="submit"
        endIcon={IS_LAST_PAGE ? <DoneIcon /> : <NavigateNextIcon />}
        color="success"
        size="large"
        data-testid="submit-btn"
        variant="contained">
        {getButtonText(isLoading, IS_LAST_PAGE, loadingMessage)}
      </LoadingButton>
    </Box>
  );

  return (
    <Stack
      onSubmit={handleFormSubmit}
      component="form"
      justifyContent="center"
      spacing={2}
      data-testid="create-form">
      {pageNumber === 0 && (
        <GeneralInfoStep
          state={state}
          handleCollNameChange={handleCollNameChange}
          handleDescriptionChange={handleDescriptionChange}
          handleMintPriceChange={handleMintPriceChange}
        />
      )}
      {pageNumber === PAGE_1 && <TypeOfArtStep />}
      {pageNumber === PAGE_2 && (
        <StaticArtStep
          state={state}
          isLoading={isLoading}
          handleImageDrop={handleImageDrop}
          handleImageDelete={handleImageDelete}
          handleImgNameChange={handleImgNameChange}
        />
      )}
      <Box sx={formFooterStyle}>
        {alertBox}
        {formButtons}
      </Box>
    </Stack>
  );
};

export default CreateCollectionForm;
