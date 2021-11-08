import { Web3ReactProvider } from "@web3-react/core";
import Input from "components/common/Input";
import { getLibrary } from "components/wallet/Wallet";
import NetworkProvider from "context/network/NetworkProvider";
import ThemeProvider from "context/theme/ThemeProvider";
import { mount } from "enzyme";

test("Input snapshot", () => {
  const tree = mount(
    <ThemeProvider>
      <NetworkProvider>
        <Web3ReactProvider getLibrary={getLibrary}>
          <Input
            onChange={() => console.log("input change occurred")}
            value="test"
            label="test"
            placeholder="This is a test"
          />
        </Web3ReactProvider>
      </NetworkProvider>
    </ThemeProvider>
  );
  expect(tree).toMatchSnapshot();
});

test("Input snapshot with error", () => {
  const tree = mount(
    <ThemeProvider>
      <NetworkProvider>
        <Web3ReactProvider getLibrary={getLibrary}>
          <Input
            onChange={() => console.log("input change occurred")}
            value="test"
            label="test"
            placeholder="This is a test"
            error="This is an error"
          />
        </Web3ReactProvider>
      </NetworkProvider>
    </ThemeProvider>
  );
  expect(tree).toMatchSnapshot();
});
