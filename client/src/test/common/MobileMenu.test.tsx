import { DAppProvider } from "@usedapp/core";
import MobileMenu from "components/common/MobileMenu";
import NetworkProvider from "context/network/NetworkProvider";
import ThemeProvider from "context/theme/ThemeProvider";
import { mount } from "enzyme";
import EnzymeToJson from "enzyme-to-json";

const anchorOrigin: AnchorOriginType = { vertical: "top", horizontal: "right" };

test("MobileMenu snapshot", () => {
  const toJson = EnzymeToJson;
  const mockAnchorEl = document.createElement("button");
  const tree = mount(
    <ThemeProvider>
      <NetworkProvider>
        <DAppProvider config={{}}>
          <MobileMenu
            isOpen={true}
            anchorEl={mockAnchorEl}
            anchOrigin={anchorOrigin}
            handleClose={() => {
              console.log("test");
            }}
          />
        </DAppProvider>
      </NetworkProvider>
    </ThemeProvider>
  );
  expect(toJson(tree)).toMatchSnapshot();
});
