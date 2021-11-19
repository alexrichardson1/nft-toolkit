import axios from "axios";
import { getDollarValue } from "utils/coinGecko";
jest.mock("axios");

describe("getUSDValue", () => {
  test("Fails to get usd value of native token from invalid chainId", () => {
    axios.get.mockResolvedValue({ data: { ethereum: { usd: 0.0 } } });
    const INVALID_CHAIN = -1;
    expect(getDollarValue("100", INVALID_CHAIN)).rejects.toThrow();
  });

  test("Gets usd value of native token from chainId", () => {
    axios.get.mockResolvedValue({ data: { ethereum: { usd: 0.0 } } });
    const RINKEBY_ETH = 4;
    expect(getDollarValue("100", RINKEBY_ETH)).resolves.toEqual("($0.00)");
  });
});
