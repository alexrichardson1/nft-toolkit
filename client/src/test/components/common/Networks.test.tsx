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
