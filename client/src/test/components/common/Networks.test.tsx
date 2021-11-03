import { fireEvent, render } from "@testing-library/react";
import { Web3ReactProvider } from "@web3-react/core";
import NetworkSpeedDial from "components/common/Networks";
import { getLibrary } from "components/Wallet";
import NetworkProvider from "context/network/NetworkProvider";
import ThemeProvider from "context/theme/ThemeProvider";
import { mount } from "enzyme";

test("NetworksSpeedDial snapshot", () => {
  const tree = mount(
    <ThemeProvider>
      <NetworkProvider>
        <Web3ReactProvider getLibrary={getLibrary}>
          <NetworkSpeedDial />
        </Web3ReactProvider>
      </NetworkProvider>
    </ThemeProvider>
  );
  expect(tree).toMatchSnapshot();
});

test("NetworksSpeedDial network changes", () => {
  const tree = render(
    <ThemeProvider>
      <NetworkProvider>
        <Web3ReactProvider getLibrary={getLibrary}>
          <NetworkSpeedDial />
        </Web3ReactProvider>
      </NetworkProvider>
    </ThemeProvider>
  );
  fireEvent.click(tree.getByTestId("Avalanche"));
  expect(tree).toMatchSnapshot();
});
