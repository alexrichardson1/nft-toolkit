import { Web3ReactProvider } from "@web3-react/core";
import { getLibrary } from "components/wallet/Wallet";
import NetworkProvider from "context/network/NetworkProvider";
import ThemeProvider from "context/theme/ThemeProvider";
import { mount, ReactWrapper } from "enzyme";
import MintingPage from "pages/MintingPage";
import StoreProvider from "store/StoreProvider";

jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useParams: () => ({
    collectionName: "Example Collection",
  }),
}));

describe("MintingPage tests", () => {
  let tree: ReactWrapper<
    unknown,
    Readonly<unknown>,
    React.Component<unknown, unknown, unknown>
  >;

  beforeAll(() => {
    tree = mount(
      <ThemeProvider>
        <NetworkProvider>
          <StoreProvider>
            <Web3ReactProvider getLibrary={getLibrary}>
              <MintingPage />
            </Web3ReactProvider>
          </StoreProvider>
        </NetworkProvider>
      </ThemeProvider>
    );
  });

  test("MintingPage snapshot", () => {
    expect(tree).toMatchSnapshot();
  });

  test("Increasing minting quantity", () => {
    tree.find("#increase-quantity").first().simulate("click");
    expect(tree).toMatchSnapshot();
  });

  test("Decreasing minting quantity", () => {
    tree.find("#increase-quantity").first().simulate("click");
    tree.find("#increase-quantity").first().simulate("click");
    tree.find("#decrease-quantity").first().simulate("click");
    expect(tree).toMatchSnapshot();
  });
});
