import CssBaseline from "@mui/material/CssBaseline";
import { Web3ReactProvider } from "@web3-react/core";
import App from "App";
import { getLibrary } from "components/wallet/Wallet";
import NetworkProvider from "context/network/NetworkProvider";
import SnackbarProvider from "context/snackbar/SnackbarProvider";
import ThemeProvider from "context/theme/ThemeProvider";
import React from "react";
import ReactDOM from "react-dom";
import StoreProvider from "store/StoreProvider";

ReactDOM.render(
  <React.StrictMode>
    <CssBaseline />
    <ThemeProvider>
      <NetworkProvider>
        <SnackbarProvider>
          <StoreProvider>
            <Web3ReactProvider getLibrary={getLibrary}>
              <App />
            </Web3ReactProvider>
          </StoreProvider>
        </SnackbarProvider>
      </NetworkProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
