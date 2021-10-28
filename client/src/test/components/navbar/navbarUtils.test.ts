import { connectWallet } from "components/navbar/navbarUtils";

describe("navbarUtils unit tests", () => {
  test("connectWallet account!=null", () => {
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
});
