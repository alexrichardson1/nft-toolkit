import { User } from "@models/user";
import { RequestHandler } from "express";

export const addDeployedAddress: RequestHandler = async (req, res, next) => {
  const { deployedAddress, fromAddress, collectionName } = req.params;
  if (!fromAddress || !collectionName || !deployedAddress) {
    return next(new Error("Invalid params"));
  }
  const user = await User.findOne({
    fromAddress: fromAddress,
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
  collection.address = deployedAddress;
  await user.save();
  return res.json({ success: true });
};
