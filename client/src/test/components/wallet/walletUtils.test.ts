import { Web3Provider } from "@ethersproject/providers";
import {
  getAccountString,
  switchChain,
  updateNetwork,
} from "components/wallet/walletUtils";
import EthereumLogo from "images/ethereum-logo.svg";

describe("walletUtils unit tests", () => {
  test("getAccountString account==null", () => {
    const account = null;
    expect(getAccountString(account)).toBe("Connect Wallet");
  });

  test("getAccountString account!=null", () => {
    const account = "0x0911F038543c34fE67C16650b3Cc213D30123456";
    expect(getAccountString(account)).toBe("0x0911F0....3456");
  });

  test("Check that updateNetwork updates network based on chainId", () => {
    const setSelectedNet = jest.fn();
    const showSnackbar = jest.fn();
    const ETH_ID = 1;
    updateNetwork(ETH_ID, setSelectedNet, showSnackbar);
    expect(setSelectedNet).toHaveBeenCalledWith({
      name: "Ethereum",
      icon: EthereumLogo,
      chainId: 1,
    });
    expect(showSnackbar).toHaveBeenCalledWith(
      "success",
      "Connected to Ethereum Mainnet"
    );
  });

  test("Check that updateNetwork doesn't updates network with invalid chainId", () => {
    const setSelectedNet = jest.fn();
    const showSnackbar = jest.fn();
    const INVALID_ID = -1;
    updateNetwork(INVALID_ID, setSelectedNet, showSnackbar);
    expect(setSelectedNet).toHaveBeenCalledTimes(0);
  });

  test("Able to change network if undefined library (wallet not connected)", () => {
    const setNetwork = jest.fn();
    const showSnackbar = jest.fn();
    const mockNetwork = { name: "Polygon", chainId: 137 } as NetworkT;
    switchChain(mockNetwork, void 0, setNetwork, showSnackbar);
    expect(setNetwork).toHaveBeenCalledWith(mockNetwork);
  });

  test("Does not change to non-EVM blockchains if wallet connected", () => {
    const setNetwork = jest.fn();
    const showSnackbar = jest.fn();
    const mockNetwork = { name: "Cardano" } as NetworkT;
    switchChain(mockNetwork, {} as Web3Provider, setNetwork, showSnackbar);
    expect(setNetwork).toHaveBeenCalledTimes(0);
  });

  test("Shows snackbar error when switch chain returns an error other than network not found", () => {
    const send = jest.fn(async (): Promise<void> => {
      await void 0;
      const error = {
        message: "Error",
        code: -1,
      };
      throw error;
    });
    const mockNetwork = { name: "Polygon", chainId: 137 } as NetworkT;
    switchChain(
      mockNetwork,
      { send: send } as unknown as Web3Provider,
      jest.fn(),
      jest.fn()
    );
    expect(send).toHaveBeenCalledTimes(1);
  });

  test("Shows snackbar error when switch chain returns an error other than network not found", () => {
    const send = jest.fn(async (): Promise<void> => {
      await void 0;
      const error = {
        message: "Error",
        code: -1,
      };
      throw error;
    });
    const mockNetwork = { name: "Polygon", chainId: 137 } as NetworkT;
    switchChain(
      mockNetwork,
      { send: send } as unknown as Web3Provider,
      jest.fn(),
      jest.fn()
    );
    expect(send).toHaveBeenCalledTimes(1);
  });

  test("Shows snackbar success when switch chain is successful", () => {
    const send = jest.fn(
      (): Promise<void> => new Promise((resolve) => resolve())
    );
    const mockNetwork = { name: "Polygon", chainId: 137 } as NetworkT;
    switchChain(
      mockNetwork,
      { send: send } as unknown as Web3Provider,
      jest.fn(),
      jest.fn()
    );
    expect(send).toHaveBeenCalledTimes(1);
  });

  test("Shows switch in metamask when switch chain returns an error of network not found", () => {
    const send = jest.fn(async (): Promise<void> => {
      await void 0;
      const error = {
        message: "Error",
        code: 4902,
      };
      throw error;
    });
    const mockNetwork = { name: "Polygon", chainId: 137 } as NetworkT;
    switchChain(
      mockNetwork,
      { send: send } as unknown as Web3Provider,
      jest.fn(),
      jest.fn()
    );
    expect(send).toHaveBeenCalledTimes(1);
  });
});
