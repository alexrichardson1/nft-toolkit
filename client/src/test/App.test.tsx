import { Web3ReactProvider } from "@web3-react/core";
import App from "App";
import { getLibrary } from "components/wallet/Wallet";
import NetworkProvider from "context/network/NetworkProvider";
import ThemeProvider from "context/theme/ThemeProvider";
import { mount } from "enzyme";
import StoreProvider from "store/StoreProvider";

test("App snapshot", () => {
  const tree = mount(
    <ThemeProvider>
      <NetworkProvider>
        <StoreProvider>
          <Web3ReactProvider getLibrary={getLibrary}>
            <App />
          </Web3ReactProvider>
        </StoreProvider>
      </NetworkProvider>
    </ThemeProvider>
  );
  expect(tree).toMatchSnapshot();
});
