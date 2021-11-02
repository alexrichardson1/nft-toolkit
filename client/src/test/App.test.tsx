import { DAppProvider } from "@usedapp/core";
import App from "App";
import NetworkProvider from "context/network/NetworkProvider";
import ThemeProvider from "context/theme/ThemeProvider";
import { mount } from "enzyme";
import StoreProvider from "store/StoreProvider";

test("App snapshot", () => {
  const tree = mount(
    <ThemeProvider>
      <NetworkProvider>
        <StoreProvider>
          <DAppProvider config={{}}>
            <App />
          </DAppProvider>
        </StoreProvider>
      </NetworkProvider>
    </ThemeProvider>
  );
  expect(tree).toMatchSnapshot();
});
