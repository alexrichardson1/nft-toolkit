import ClearIcon from "@mui/icons-material/Clear";
import DoneIcon from "@mui/icons-material/Done";
import { LoadingButton } from "@mui/lab";
import { Box, Button } from "@mui/material";

interface PropsI {
  isLoading: boolean;
  loadingMessage: string;
  handleStateReset: () => void;
}

const FormButtons = ({
  isLoading,
  loadingMessage,
  handleStateReset,
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
        data-testid="reset"
        color="error"
        size="large"
        variant="contained"
        type="reset"
        disabled={isLoading}
        onClick={handleStateReset}>
        Reset
      </Button>
      <LoadingButton
        sx={loadingButtonStyle}
        loading={isLoading}
        loadingPosition="end"
        type="submit"
        endIcon={<DoneIcon />}
        color="success"
        size="large"
        data-testid="submit-btn"
        variant="contained">
        {isLoading ? loadingMessage : "Submit"}
      </LoadingButton>
    </Box>
  );
};

export default FormButtons;
