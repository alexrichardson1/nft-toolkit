import { getCollectionFromDB } from "@controllers/collection";
import { BaseProvider } from "@ethersproject/providers";
import { CollectionT } from "@models/collection";
import {
  Market__factory as MarketFactory,
  NFT__factory as NFTFactory,
} from "@server/../smart-contracts/typechain";
import { ethers, utils } from "ethers";
import { RequestHandler } from "express";

const FIRST_TOKEN_NO = 0;

export const getTokenMetadata: RequestHandler = async (req, res, next) => {
  const { chainId, address, tokenId } = req.params;
  if (!chainId || !address || !tokenId) {
    return next(new Error("Invalid params"));
  }

  let collection: CollectionT;
  try {
    collection = await getCollectionFromDB(
      utils.getAddress(address),
      parseInt(chainId)
    );
  } catch (error) {
    return next(error);
  }

  const tokenNumber = parseInt(tokenId);
  const numTokens = collection.tokens.length;
  if (tokenNumber < FIRST_TOKEN_NO || tokenNumber >= numTokens) {
    return next(new Error("Token id not found in collection"));
  }
  return res.json(collection.tokens[tokenNumber]);
};

const getRPCProvider = (_chainId: number): BaseProvider => {
  const network = ethers.providers.getNetwork(_chainId);
  return new ethers.providers.InfuraProvider(
    network,
    "2f3b86cc63ff4530aee2c42dea69b22a"
  );
};

export const getCollectionMetadata: RequestHandler = async (req, res, next) => {
  const { chainId, address } = req.params;
  if (!chainId || !address) {
    return next(new Error("Invalid params"));
  }

  const chainIdNum = parseInt(chainId);

  let collection: CollectionT;
  try {
    collection = await getCollectionFromDB(
      utils.getAddress(address),
      chainIdNum
    );
  } catch (error) {
    return next(error);
  }

  if (!collection.address) {
    return next(new Error("Collection not deployed"));
  }

  const provider = getRPCProvider(chainIdNum);
  const nftContract = NFTFactory.connect(collection.address, provider);
  const half = 2;
  const midToken = collection.tokens[collection.tokens.length / half];
  if (!midToken) {
    return next(new Error("Tokens not configured properly"));
  }

  const result = {
    name: await nftContract.name(),
    image: midToken.image,
    description: collection.description,
    fee_recipient: collection.creator,
  };

  if (collection.marketAddress) {
    const marketContract = MarketFactory.connect(
      collection.marketAddress,
      provider
    );
    const toSellerFee = 100;
    const seller_fee_basis_points =
      (await marketContract.royalty()).toNumber() * toSellerFee;
    return res.json({ ...result, seller_fee_basis_points });
  }

  return res.json(result);
};
