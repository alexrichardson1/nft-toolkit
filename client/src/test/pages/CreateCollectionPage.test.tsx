import { DAppProvider } from "@usedapp/core";
import NetworkProvider from "context/network/NetworkProvider";
import ThemeProvider from "context/theme/ThemeProvider";
import { mount } from "enzyme";
import EnzymeToJson from "enzyme-to-json";
import CreateCollectionPage from "pages/CreateCollectionPage";

test("CreateCollectionPage snapshot", () => {
  const toJson = EnzymeToJson;
  const tree = mount(
    <ThemeProvider>
      <NetworkProvider>
        <DAppProvider config={{}}>
          <CreateCollectionPage />
        </DAppProvider>
      </NetworkProvider>
    </ThemeProvider>
  );
  expect(toJson(tree)).toMatchSnapshot();
});
