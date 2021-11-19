import { BaseProvider } from "@ethersproject/providers";
import axios from "axios";
import { BigNumber, ethers } from "ethers";
import { API_URL } from "./constants";

interface TokenI {
  image: string;
}
// TODO: collection gif
export interface CollectionI {
  name: string;
  address: string;
  mintedAmount: BigNumber;
  symbol: string;
  description: string;
  limit: BigNumber;
  tokens: TokenI[];
  gifSrc?: string;
  chainId: number;
  price: string;
}

export const getCollection = async (
  fromAddress: string,
  collectionName: string
): Promise<CollectionI> => {
  const res = await axios.get(
    `${API_URL}/collection/${fromAddress}/${collectionName}`
  );
  const { collection }: { collection: CollectionI } = res.data;
  return collection;
};

export const getRPCProvider = (_chainId: number): BaseProvider => {
  const network = ethers.providers.getNetwork(_chainId);
  return new ethers.providers.InfuraProvider(
    network,
    "2f3b86cc63ff4530aee2c42dea69b22a"
  );
};
