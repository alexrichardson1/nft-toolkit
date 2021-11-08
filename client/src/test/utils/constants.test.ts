import EthereumLogo from "images/ethereum-logo.svg";
import { getLogoByChainId } from "utils/constants";

describe("getLogoByChainId", () => {
  test("Invalid chain Id", () => {
    const INVALID_ID = -1;
    expect(getLogoByChainId(INVALID_ID) === EthereumLogo);
  });
});
