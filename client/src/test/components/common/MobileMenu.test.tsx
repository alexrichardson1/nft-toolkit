import { PopoverOrigin } from "@mui/material";
import { DAppProvider } from "@usedapp/core";
import MobileMenu from "components/common/MobileMenu";
import NetworkProvider from "context/network/NetworkProvider";
import ThemeProvider from "context/theme/ThemeProvider";
import { mount } from "enzyme";

const anchorOrigin: PopoverOrigin = { vertical: "top", horizontal: "right" };

test("MobileMenu snapshot", () => {
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
  expect(tree).toMatchSnapshot();
});
