import React from "react";
import ReactDOM from "react-dom";
import App from "components/App";
import CssBaseline from "@mui/material/CssBaseline";
import ThemeProvider from "context/theme/ThemeProvider";

ReactDOM.render(
  <React.StrictMode>
    <CssBaseline />
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
