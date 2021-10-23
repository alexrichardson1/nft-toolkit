import { DAppProvider } from "@usedapp/core";
import NetworkProvider from "context/network/NetworkProvider";
import ThemeProvider from "context/theme/ThemeProvider";
import { mount } from "enzyme";
import EnzymeToJson from "enzyme-to-json";
import MintingPage from "pages/CreateCollectionPage";

test("MintingPage snapshot", () => {
  const toJson = EnzymeToJson;
  const tree = mount(
    <ThemeProvider>
      <NetworkProvider>
        <DAppProvider config={{}}>
          <MintingPage />
        </DAppProvider>
      </NetworkProvider>
    </ThemeProvider>
  );
  expect(toJson(tree)).toMatchSnapshot();
});
