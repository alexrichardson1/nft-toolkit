import { render, screen } from "@testing-library/react";
import App from "components/App";
import ThemeProvider from "context/theme/ThemeProvider";
import NetworkProvider from "context/network/NetworkProvider";
import { DAppProvider } from "@usedapp/core";

test("renders NFToolkit logo", () => {
  render(
    <ThemeProvider>
      <NetworkProvider>
        <DAppProvider config={{}}>
          <App />
        </DAppProvider>
      </NetworkProvider>
    </ThemeProvider>
  );
  const linkElement = screen.getByText(/NFToolkit/i);
  expect(linkElement).toBeInTheDocument();
});
