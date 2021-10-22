import {
  AlertColor,
  AlertProps,
  Slide,
  Snackbar,
  SnackbarCloseReason,
  SnackbarOrigin,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { forwardRef, useState } from "react";
import SnackbarContext from "./SnackbarContext";
const snackbarStyle = { width: "100%" };

const Alert = forwardRef<HTMLDivElement, AlertProps>((props, ref) => {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

Alert.displayName = "Alert";

const INITIAL_ALERT_COLOR = "success";
const SNACKBAR_DURATION = 6000;
const SBAR_ANCHOR_ORIGIN: SnackbarOrigin = {
  vertical: "top",
  horizontal: "center",
};

const SnackbarProvider = (props: ProviderPropsI): JSX.Element => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("Success!");
  const [severity, setSeverity] = useState<AlertColor>(INITIAL_ALERT_COLOR);
  const showSnackbar = (type: AlertColor, message: string) => {
    setSeverity(type);
    setMessage(message);
    setOpen(true);
  };
  const handleSnackbarClose = (
    _event?: React.SyntheticEvent<unknown, Event>,
    reason?: SnackbarCloseReason
  ): void => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar: showSnackbar }}>
      <Snackbar
        anchorOrigin={SBAR_ANCHOR_ORIGIN}
        open={open}
        autoHideDuration={SNACKBAR_DURATION}
        onClose={handleSnackbarClose}
        TransitionComponent={Slide}>
        <Alert
          onClose={handleSnackbarClose}
          severity={severity}
          sx={snackbarStyle}>
          {message}
        </Alert>
      </Snackbar>
      {props.children}
    </SnackbarContext.Provider>
  );
};

export default SnackbarProvider;
