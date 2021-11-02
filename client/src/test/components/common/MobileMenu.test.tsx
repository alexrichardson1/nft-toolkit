import { PopoverOrigin } from "@mui/material";
import Queries from "@testing-library/dom/types/queries";
import {
  createEvent,
  fireEvent,
  render,
  RenderResult,
} from "@testing-library/react";
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

describe("MobileMenu unit tests", () => {
  const mockAnchorEl = document.createElement("button");
  let tree: RenderResult<typeof Queries, HTMLElement>;

  beforeAll(() => {
    tree = render(
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
  });

  test("clicking mobile menu brings it up", () => {
    const [item] = tree.getAllByTestId("menuItemMobile");
    if (!item) {
      fail("Cannot find mobile menu!");
    }
    fireEvent(item, createEvent.click(item));
    expect(tree).toMatchSnapshot();
  });

  test("changing network on mobile menu changes network", () => {
    const item = tree.getByTestId("cardano-mobile-option");
    fireEvent(item, createEvent.click(item));
    expect(tree).toMatchSnapshot();
  });
});
