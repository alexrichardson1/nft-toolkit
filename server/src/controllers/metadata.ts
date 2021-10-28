import { User } from "@models/user";
import { RequestHandler } from "express";

export const getTokenMetadata: RequestHandler = (req, res, next) => {
  const { fromAddress, collectionName, tokenId } = req.params;
  if (!fromAddress || !collectionName || !tokenId) {
    return next(new Error("Invalid params"));
  }
  const tokenNumber = parseInt(tokenId, 10);
  User.findOne({ fromAddress: fromAddress, collectionName: collectionName })
    .exec()
    .then((user) => {
      if (!user) {
        return next(new Error("Collection not found"));
      }
      const collection = user.collections.find(
        (col) => col.name === collectionName
      );
      if (!collection) {
        return next(new Error("Collection name not found"));
      }
      const token = collection.tokens[tokenNumber - 1];
      res.json(token);
      return next();
    })
    .catch((err) => {
      return next(err);
    });
  return next();
};
