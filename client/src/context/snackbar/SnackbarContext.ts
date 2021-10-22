import { AlertColor } from "@mui/material";
import { createContext } from "react";

interface SnackbarContextI {
  showSnackbar: (type: AlertColor, message: string) => void;
}

const SnackbarContext = createContext<SnackbarContextI>({
  showSnackbar: (type) => void type === type,
});

export default SnackbarContext;
