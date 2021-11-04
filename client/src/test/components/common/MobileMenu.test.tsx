import { PopoverOrigin } from "@mui/material";
import Queries from "@testing-library/dom/types/queries";
import {
  createEvent,
  fireEvent,
  render,
  RenderResult,
} from "@testing-library/react";
import { Web3ReactProvider } from "@web3-react/core";
import MobileMenu from "components/common/MobileMenu";
import { getLibrary } from "components/wallet/Wallet";
import NetworkProvider from "context/network/NetworkProvider";
import ThemeProvider from "context/theme/ThemeProvider";
import { mount } from "enzyme";

const anchorOrigin: PopoverOrigin = { vertical: "top", horizontal: "right" };

test("MobileMenu snapshot", () => {
  const mockAnchorEl = document.createElement("button");
  const tree = mount(
    <ThemeProvider>
      <NetworkProvider>
        <Web3ReactProvider getLibrary={getLibrary}>
          <MobileMenu
            isOpen={true}
            anchorEl={mockAnchorEl}
            anchOrigin={anchorOrigin}
            handleClose={() => {
              console.log("test");
            }}
          />
        </Web3ReactProvider>
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
          <Web3ReactProvider getLibrary={getLibrary}>
            <MobileMenu
              isOpen={true}
              anchorEl={mockAnchorEl}
              anchOrigin={anchorOrigin}
              handleClose={() => {
                console.log("test");
              }}
            />
          </Web3ReactProvider>
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
