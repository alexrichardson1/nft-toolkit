import axios from "axios";
import { getUSDValue } from "utils/coinGecko";
jest.mock("axios");

describe("getUSDValue", () => {
  test("Fails to get usd value of native token from invalid chainId", () => {
    axios.get.mockResolvedValue({ data: { ethereum: { usd: 0.0 } } });
    const INVALID_CHAIN = -1;
    expect(getUSDValue(INVALID_CHAIN)).rejects.toThrow();
  });

  test("Gets usd value of native token from chainId", () => {
    axios.get.mockResolvedValue({ data: { ethereum: { usd: 0.0 } } });
    const RINKEBY_ETH = 4;
    expect(getUSDValue(RINKEBY_ETH)).resolves.toEqual(0.0);
  });
});
