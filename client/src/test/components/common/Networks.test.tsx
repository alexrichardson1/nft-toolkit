import { fireEvent, render } from "@testing-library/react";
import { DAppProvider } from "@usedapp/core";
import NetworkSpeedDial from "components/common/Networks";
import NetworkProvider from "context/network/NetworkProvider";
import ThemeProvider from "context/theme/ThemeProvider";
import { mount } from "enzyme";

test("NetworksSpeedDial snapshot", () => {
  const tree = mount(
    <ThemeProvider>
      <NetworkProvider>
        <DAppProvider config={{}}>
          <NetworkSpeedDial />
        </DAppProvider>
      </NetworkProvider>
    </ThemeProvider>
  );
  expect(tree).toMatchSnapshot();
});

test("NetworksSpeedDial network changes", () => {
  const tree = render(
    <ThemeProvider>
      <NetworkProvider>
        <DAppProvider config={{}}>
          <NetworkSpeedDial />
        </DAppProvider>
      </NetworkProvider>
    </ThemeProvider>
  );
  fireEvent.click(tree.getByTestId("Avalanche"));
  expect(tree).toMatchSnapshot();
});
