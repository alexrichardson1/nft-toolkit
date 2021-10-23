import { DAppProvider } from "@usedapp/core";
import CreateCollectionForm from "components/create-collection-form/CreateCollectionForm";
import NetworkProvider from "context/network/NetworkProvider";
import ThemeProvider from "context/theme/ThemeProvider";
import { mount } from "enzyme";
import EnzymeToJson from "enzyme-to-json";

test("CreateCollectionForm snapshot", () => {
  const toJson = EnzymeToJson;
  const tree = mount(
    <ThemeProvider>
      <NetworkProvider>
        <DAppProvider config={{}}>
          <CreateCollectionForm />
        </DAppProvider>
      </NetworkProvider>
    </ThemeProvider>
  );
  expect(toJson(tree)).toMatchSnapshot();
});
