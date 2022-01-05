import CloseIcon from "@mui/icons-material/Close";
import { Alert, AlertColor, Collapse, IconButton } from "@mui/material";
import React from "react";
import { DEFAULT_ALERT_ELEVATION } from "utils/constants";

const alertContainerStyle = { flexGrow: 1 };

interface PropsT {
  alertMessage: string;
  alertSeverity: AlertColor;
  closeAlert: () => void;
}

const FormAlert = ({
  alertMessage,
  alertSeverity,
  closeAlert,
}: PropsT): JSX.Element => (
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

export default React.memo(FormAlert);
