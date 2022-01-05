import { getCollectionFromDB } from "@controllers/collection";
import { SITE_URL } from "@controllers/common";
import { BaseProvider } from "@ethersproject/providers";
import { CollectionT } from "@models/collection";
import { NFT__factory as NFTFactory } from "@server/../smart-contracts/typechain";
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

export const getAllTokenMetadata: RequestHandler = async (req, res, next) => {
  const { chainId, address } = req.params;
  if (!chainId || !address) {
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

  return res.json({ tokens: collection.tokens });
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
  const external_link = `${SITE_URL}/${collection.chainId}/${collection.address}`;

  const result = {
    name: await nftContract.name(),
    image: collection.image,
    description: collection.description,
    external_link,
    fee_recipient: collection.creator,
  };

  if (collection.marketAddress) {
    const toSellerFee = 10000;
    const [, royaltyInfo] = await nftContract.royaltyInfo(0, toSellerFee);
    const seller_fee_basis_points = royaltyInfo.toNumber();
    return res.json({ ...result, seller_fee_basis_points });
  }

  return res.json(result);
};
