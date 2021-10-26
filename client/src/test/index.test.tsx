import { CssBaseline } from "@mui/material";
import { DAppProvider } from "@usedapp/core";
import App from "App";
import NetworkProvider from "context/network/NetworkProvider";
import SnackbarProvider from "context/snackbar/SnackbarProvider";
import ThemeProvider from "context/theme/ThemeProvider";
import React from "react";
import ReactDOM from "react-dom";

jest.mock("react-dom", () => ({ render: jest.fn() }));

describe("Test index.tsx", () => {
  test("App renders without crashing", async () => {
    const div = document.createElement("div");
    div.id = "root";
    document.body.appendChild(div);
    await import("index");
    expect(ReactDOM.render).toHaveBeenCalledWith(
      <React.StrictMode>
        <CssBaseline />
        <ThemeProvider>
          <NetworkProvider>
            <SnackbarProvider>
              <DAppProvider config={{}}>
                <App />
              </DAppProvider>
            </SnackbarProvider>
          </NetworkProvider>
        </ThemeProvider>
      </React.StrictMode>,
      div
    );
  });
});
