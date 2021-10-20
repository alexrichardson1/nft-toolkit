import React from "react";
import ReactDOM from "react-dom";
import App from "components/App";
import CssBaseline from "@mui/material/CssBaseline";
import ThemeProvider from "context/theme/ThemeProvider";
import NetworkProvider from "context/network/NetworkProvider";

ReactDOM.render(
  <React.StrictMode>
    <CssBaseline />
    <ThemeProvider>
      <NetworkProvider>
        <App />
      </NetworkProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
