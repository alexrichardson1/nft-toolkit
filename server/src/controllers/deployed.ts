import { User } from "@models/user";
import { RequestHandler } from "express";

export const addDeployedAddress: RequestHandler = async (req, res, next) => {
  const { deployedAddress, fromAddress, collectionName } = req.params;
  const user = await User.findOne({
    fromAddress: fromAddress,
  }).exec();
  if (!user) {
    return next(new Error("Sorry can't find that user"));
  }
  const collection = user.collections.find(
    (col) => col.name === collectionName
  );
  if (!collection) {
    return next(new Error("Sorry can't find that collection"));
  }
  collection.address = deployedAddress;
  user.save().catch((err: Error) => {
    return next(err);
  });
  return res.json({ success: true });
};
