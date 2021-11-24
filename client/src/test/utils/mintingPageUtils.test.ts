import { getRPCProvider } from "utils/mintingPageUtils";
jest.mock("axios");

describe("Get RPC provider", () => {
  test("Gets collection", () => {
    const RINKEBY = 4;
    expect(getRPCProvider(RINKEBY)).toBeTruthy();
  });
});
