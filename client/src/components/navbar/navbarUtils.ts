import { AlertColor } from "@mui/material";

export const connectWallet = (
  deactivate: () => void,
  showSnackbar: (type: AlertColor, message: string) => void,
  activateBrowserWallet: (
    onError?: (error: Error) => void,
    throwErrors?: boolean
  ) => void,
  account?: string | null
): void => {
  if (account) {
    deactivate();
    return;
  }
  activateBrowserWallet();
  if (account) {
    showSnackbar("success", "Your wallet has been connected!");
    return;
  }
  showSnackbar("error", "Your wallet was not connected. Please try again.");
};
