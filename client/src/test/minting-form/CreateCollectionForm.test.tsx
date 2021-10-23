import { DAppProvider } from "@usedapp/core";
import MintingForm from "components/minting-form/CreateCollectionForm";
import NetworkProvider from "context/network/NetworkProvider";
import ThemeProvider from "context/theme/ThemeProvider";
import { mount } from "enzyme";
import EnzymeToJson from "enzyme-to-json";

test("MintingForm snapshot", () => {
  const toJson = EnzymeToJson;
  const tree = mount(
    <ThemeProvider>
      <NetworkProvider>
        <DAppProvider config={{}}>
          <MintingForm />
        </DAppProvider>
      </NetworkProvider>
    </ThemeProvider>
  );
  expect(toJson(tree)).toMatchSnapshot();
});
