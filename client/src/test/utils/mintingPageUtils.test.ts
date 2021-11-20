import axios from "axios";
import { getCollection, getRPCProvider } from "utils/mintingPageUtils";
jest.mock("axios");

describe("getCollection", () => {
  test("Gets collection", () => {
    axios.get.mockResolvedValue({ data: { collection: {} } });
    expect(
      getCollection("0xA7184E32858b3B3F3C5D33ef21cadFFDb7db0752", "Test")
    ).resolves.not.toThrow();
  });
});

describe("Get RPC provider", () => {
  test("Gets collection", () => {
    const RINKEBY = 4;
    expect(getRPCProvider(RINKEBY)).toBeTruthy();
  });
});
