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

export const getAccountString = (account?: string | null): string => {
  if (!account) {
    return "Connect Wallet";
  }
  const START_CHARS = 8;
  const END_CHARS = 4;
  return `${account.slice(0, START_CHARS)}....${account.slice(-END_CHARS)}`;
};
