import { Web3ReactProvider } from "@web3-react/core";
import TabPanel from "components/create-collection-form/tabs/TabPanel";
import { getLibrary } from "components/Wallet";
import NetworkProvider from "context/network/NetworkProvider";
import ThemeProvider from "context/theme/ThemeProvider";
import { mount } from "enzyme";

test("TabPanel snapshot", () => {
  const tree = mount(
    <ThemeProvider>
      <NetworkProvider>
        <Web3ReactProvider getLibrary={getLibrary}>
          <TabPanel index={0} value={0} />
        </Web3ReactProvider>
      </NetworkProvider>
    </ThemeProvider>
  );
  expect(tree).toMatchSnapshot();
});
