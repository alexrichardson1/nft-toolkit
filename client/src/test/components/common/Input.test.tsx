import { DAppProvider } from "@usedapp/core";
import Input from "components/common/Input";
import NetworkProvider from "context/network/NetworkProvider";
import ThemeProvider from "context/theme/ThemeProvider";
import { mount } from "enzyme";
import EnzymeToJson from "enzyme-to-json";

test("Input snapshot", () => {
  const toJson = EnzymeToJson;
  const tree = mount(
    <ThemeProvider>
      <NetworkProvider>
        <DAppProvider config={{}}>
          <Input
            onChange={() => console.log("input change occurred")}
            value="test"
            label="test"
            placeholder="This is a test"
          />
        </DAppProvider>
      </NetworkProvider>
    </ThemeProvider>
  );
  expect(toJson(tree)).toMatchSnapshot();
});
