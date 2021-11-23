import { BaseProvider } from "@ethersproject/providers";
import axios from "axios";
import { BigNumber, ethers } from "ethers";
import { NFT__factory as NftFactory } from "typechain";
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
  gifSrc: string;
  chainId: number;
  price: BigNumber;
}

export const getCollection = async (
  chainId: string,
  address: string
): Promise<CollectionI> => {
  const res = await axios.get(`${API_URL}/collection/${chainId}/${address}`);
  const { collection }: { collection: CollectionI } = res.data;
  const NFTContract = NftFactory.connect(
    collection.address,
    getRPCProvider(collection.chainId)
  );
  collection.limit = await NFTContract.collectionLimit();
  collection.mintedAmount = await NFTContract.tokenIdTracker();
  collection.tokens.forEach((token) => {
    collection.gifSrc = token.image;
  });
  collection.gifSrc = collection.gifSrc?.replaceAll(" ", "%20");
  collection.price = await NFTContract.price();
  collection.name = await NFTContract.name();
  collection.symbol = await NFTContract.symbol();
  return collection;
};

export const getRPCProvider = (_chainId: number): BaseProvider => {
  const network = ethers.providers.getNetwork(_chainId);
  return new ethers.providers.InfuraProvider(
    network,
    "2f3b86cc63ff4530aee2c42dea69b22a"
  );
};
