import React from "react";
import ReactDOM from "react-dom";
import App from "components/App";
import CssBaseline from "@mui/material/CssBaseline";
import ThemeProvider from "context/theme/ThemeProvider";
import NetworkProvider from "context/network/NetworkProvider";
import { DAppProvider } from "@usedapp/core";

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
