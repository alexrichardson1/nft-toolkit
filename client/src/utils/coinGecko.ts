import axios from "axios";

interface IdToStrI {
  [key: number]: string;
}

const chainIDToCoinGecko: IdToStrI = {
  4: "ethereum",
  137: "matic-network",
  43114: "avalanche-2",
  56: "binancecoin",
};

export const getUSDValue = async (chainId: number): Promise<number> => {
  const network = chainIDToCoinGecko[chainId];
  if (!network) {
    throw new Error(`Unsupported chain id: ${chainId}`);
  }
  const res = await axios.get(
    `https://api.coingecko.com/api/v3/simple/price?ids=${network}&vs_currencies=USD`
  );
  return res.data[network].usd;
};
