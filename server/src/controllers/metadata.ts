import { getCollectionFromDB } from "@controllers/collection";
import { CollectionT } from "@models/collection";
import { RequestHandler } from "express";

const FIRST_TOKEN_NO = 0;

export const getTokenMetadata: RequestHandler = async (req, res, next) => {
  const { chainId, address, tokenId } = req.params;
  if (!chainId || !address || !tokenId) {
    return next(new Error("Invalid params"));
  }

  let collection: CollectionT;
  try {
    collection = await getCollectionFromDB(address, parseInt(chainId));
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
