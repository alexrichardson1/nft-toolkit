import CssBaseline from "@mui/material/CssBaseline";
import { DAppProvider } from "@usedapp/core";
import App from "App";
import NetworkProvider from "context/network/NetworkProvider";
import ThemeProvider from "context/theme/ThemeProvider";
import React from "react";
import ReactDOM from "react-dom";

ReactDOM.render(
  <React.StrictMode>
    <CssBaseline />
    <ThemeProvider>
      <NetworkProvider>
        <DAppProvider config={{}}>
          <App />
        </DAppProvider>
      </NetworkProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
