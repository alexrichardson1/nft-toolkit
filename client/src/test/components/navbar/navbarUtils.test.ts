import { connectWallet, getAccountString } from "components/navbar/navbarUtils";

describe("navbarUtils unit tests", () => {
  test("connectWallet account!=null calls deactivate", () => {
    const account = "testAccount";
    const mockDeactivate = jest.fn();
    connectWallet(mockDeactivate, jest.fn(), jest.fn(), account);
    expect(mockDeactivate).toHaveBeenCalled();
  });

  test("connectWallet account==null", () => {
    const account = null;
    const activateBrowserWallet = jest.fn();
    connectWallet(jest.fn(), jest.fn(), activateBrowserWallet, account);
    expect(activateBrowserWallet).toHaveBeenCalled();
  });

  test("getAccountString account==null", () => {
    const account = null;
    expect(getAccountString(account)).toBe("Connect Wallet");
  });

  test("getAccountString account!=null", () => {
    const account = "0x0911F038543c34fE67C16650b3Cc213D30123456";
    expect(getAccountString(account)).toBe("0x0911F0....3456");
  });
});
