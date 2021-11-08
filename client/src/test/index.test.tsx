import { CssBaseline } from "@mui/material";
import { Web3ReactProvider } from "@web3-react/core";
import App from "App";
import { getLibrary } from "components/wallet/Wallet";
import NetworkProvider from "context/network/NetworkProvider";
import SnackbarProvider from "context/snackbar/SnackbarProvider";
import ThemeProvider from "context/theme/ThemeProvider";
import React from "react";
import ReactDOM from "react-dom";
import StoreProvider from "store/StoreProvider";

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
              <StoreProvider>
                <Web3ReactProvider getLibrary={getLibrary}>
                  <App />
                </Web3ReactProvider>
              </StoreProvider>
            </SnackbarProvider>
          </NetworkProvider>
        </ThemeProvider>
      </React.StrictMode>,
      div
    );
  });
});
