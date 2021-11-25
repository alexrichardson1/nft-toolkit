import ClearIcon from "@mui/icons-material/Clear";
import DoneIcon from "@mui/icons-material/Done";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { LoadingButton } from "@mui/lab";
import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import { getSubmissionButtonText } from "utils/formUtils";

interface PropsI {
  isLoading: boolean;
  loadingMessage: string;
  stepNumber: number;
  isLastStep: boolean;
  handlePrevStep: () => void;
}

const INITIAL_STEP_NUMBER = 0;

const FormButtons = ({
  isLoading,
  loadingMessage,
  stepNumber,
  isLastStep,
  handlePrevStep,
}: PropsI): JSX.Element => {
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

  return (
    <Box sx={buttonsWrapperStyle}>
      <Button
        startIcon={<ClearIcon />}
        data-testid="previous-page"
        disabled={isLoading || stepNumber === INITIAL_STEP_NUMBER}
        color="error"
        size="large"
        variant="contained"
        onClick={handlePrevStep}>
        Back
      </Button>
      {stepNumber !== 1 && (
        <LoadingButton
          sx={loadingButtonStyle}
          loading={isLoading}
          loadingPosition="end"
          type="submit"
          endIcon={isLastStep ? <DoneIcon /> : <NavigateNextIcon />}
          color="success"
          size="large"
          data-testid="submit-btn"
          variant="contained">
          {getSubmissionButtonText(isLoading, isLastStep, loadingMessage)}
        </LoadingButton>
      )}
    </Box>
  );
};

export default FormButtons;
