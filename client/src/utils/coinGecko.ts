import axios from "axios";
import { BigNumber } from "ethers";
import { formatEther } from "ethers/lib/utils";

interface IdToStrI {
  [key: number]: string;
}

const chainIDToCoinGecko: IdToStrI = {
  4: "ethereum",
  137: "matic-network",
  43114: "avalanche-2",
  56: "binancecoin",
};

const getUSDValue = async (chainId: number): Promise<number> => {
  const network = chainIDToCoinGecko[chainId];
  if (!network) {
    throw new Error(`Unsupported chain id: ${chainId}`);
  }
  const res = await axios.get(
    `https://api.coingecko.com/api/v3/simple/price?ids=${network}&vs_currencies=USD`
  );
  return res.data[network].usd;
};

export const getDollarValue = async (
  price: string,
  chainId: number
): Promise<number> => {
  const num =
    parseFloat(formatEther(BigNumber.from(price))) *
    (await getUSDValue(chainId));
  return num;
};
