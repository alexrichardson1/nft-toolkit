import { DAppProvider } from "@usedapp/core";
import Input from "components/common/Input";
import NetworkProvider from "context/network/NetworkProvider";
import ThemeProvider from "context/theme/ThemeProvider";
import { mount } from "enzyme";

test("Input snapshot", () => {
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
  expect(tree).toMatchSnapshot();
});

test("Input snapshot with error", () => {
  const tree = mount(
    <ThemeProvider>
      <NetworkProvider>
        <DAppProvider config={{}}>
          <Input
            onChange={() => console.log("input change occurred")}
            value="test"
            label="test"
            placeholder="This is a test"
            error="This is an error"
          />
        </DAppProvider>
      </NetworkProvider>
    </ThemeProvider>
  );
  expect(tree).toMatchSnapshot();
});
