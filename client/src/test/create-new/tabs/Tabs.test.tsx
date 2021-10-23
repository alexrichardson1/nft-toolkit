import { DAppProvider } from "@usedapp/core";
import Tabs from "components/create-new/tabs/Tabs";
import NetworkProvider from "context/network/NetworkProvider";
import ThemeProvider from "context/theme/ThemeProvider";
import { mount } from "enzyme";
import EnzymeToJson from "enzyme-to-json";

test("Tabs snapshot", () => {
  const toJson = EnzymeToJson;
  const tree = mount(
    <ThemeProvider>
      <NetworkProvider>
        <DAppProvider config={{}}>
          <Tabs
            imgObjs={[]}
            handleImageDelete={() => console.log("Image deleted during test")}
            handleNameChange={() => console.log("Name changed during test")}
          />
        </DAppProvider>
      </NetworkProvider>
    </ThemeProvider>
  );
  expect(toJson(tree)).toMatchSnapshot();
});
