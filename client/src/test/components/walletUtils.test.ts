import { getAccountString, updateNetwork } from "components/walletUtils";
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
    const ETH_ID = 1;
    updateNetwork(ETH_ID, setSelectedNet);
    expect(setSelectedNet).toHaveBeenCalledWith({
      name: "Ethereum",
      icon: EthereumLogo,
      chainId: 1,
    });
  });

  test("Check that updateNetwork doesn't updates network with invalid chainId", () => {
    const setSelectedNet = jest.fn();
    const INVALID_ID = -1;
    updateNetwork(INVALID_ID, setSelectedNet);
    expect(setSelectedNet).toHaveBeenCalledTimes(0);
  });
});
