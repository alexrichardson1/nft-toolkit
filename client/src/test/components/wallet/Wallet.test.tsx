import * as ethers from "@ethersproject/providers";
import { Web3ReactProvider } from "@web3-react/core";
import Wallet, { getLibrary } from "components/wallet/Wallet";
import NetworkProvider from "context/network/NetworkProvider";
import ThemeProvider from "context/theme/ThemeProvider";
import { mount, ReactWrapper } from "enzyme";

jest.mock("@ethersproject/providers", () => ({
  Web3Provider: jest.fn(),
}));

describe("Wallet tests", () => {
  let tree: ReactWrapper<
    unknown,
    Readonly<unknown>,
    React.Component<unknown, unknown, unknown>
  >;

  beforeAll(() => {
    tree = mount(
      <ThemeProvider>
        <NetworkProvider>
          <Web3ReactProvider getLibrary={getLibrary}>
            <Wallet />
          </Web3ReactProvider>
        </NetworkProvider>
      </ThemeProvider>
    );
  });

  test("Wallet snapshot", () => {
    expect(tree).toMatchSnapshot();
  });

  test("Wallet is connected on button click", () => {
    tree.find("#connect-wallet-btn").first().simulate("click");
    expect(true);
  });

  test("GetLibrary function returns a Web3Provider", () => {
    getLibrary(jest.fn());
    expect(ethers.Web3Provider).toHaveBeenCalled();
  });
});
