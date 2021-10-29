import { User } from "@models/user";
import { RequestHandler } from "express";

const FIRST_TOKEN_NO = 1;

export const getTokenMetadata: RequestHandler = async (req, res, next) => {
  const { fromAddress, collectionName, tokenId } = req.params;
  if (!fromAddress || !collectionName || !tokenId) {
    return next(new Error("Invalid params"));
  }
  const tokenNumber = parseInt(tokenId, 10);
  const user = await User.findOne({
    fromAddress: fromAddress,
    collectionName: collectionName,
  }).exec();
  if (!user) {
    return next(new Error("User not found"));
  }
  const collection = user.collections.find(
    (col) => col.name === collectionName
  );
  if (!collection) {
    return next(new Error("Collection name not found"));
  }
  const numTokens = collection.tokens.length;
  if (tokenNumber < FIRST_TOKEN_NO || tokenNumber > numTokens) {
    return next(new Error("Token id not found"));
  }
  const token = collection.tokens[tokenNumber - 1];
  return res.json(token);
};
