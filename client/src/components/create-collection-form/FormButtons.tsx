import ClearIcon from "@mui/icons-material/Clear";
import DoneIcon from "@mui/icons-material/Done";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { LoadingButton } from "@mui/lab";
import { Box } from "@mui/material";
import Button from "@mui/material/Button";

interface PropsI {
  isLoading: boolean;
  loadingMessage: string;
  pageNumber: number;
  isLastPage: boolean;
  handlePrevPage: () => void;
}

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

const INITIAL_PAGE_NUMBER = 0;

const FormButtons = ({
  isLoading,
  loadingMessage,
  pageNumber,
  isLastPage,
  handlePrevPage,
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
        disabled={isLoading || pageNumber === INITIAL_PAGE_NUMBER}
        color="error"
        size="large"
        variant="contained"
        onClick={handlePrevPage}>
        Back
      </Button>
      {pageNumber !== 1 && (
        <LoadingButton
          sx={loadingButtonStyle}
          loading={isLoading}
          loadingPosition="end"
          type="submit"
          endIcon={isLastPage ? <DoneIcon /> : <NavigateNextIcon />}
          color="success"
          size="large"
          data-testid="submit-btn"
          variant="contained">
          {getButtonText(isLoading, isLastPage, loadingMessage)}
        </LoadingButton>
      )}
    </Box>
  );
};

export default FormButtons;
