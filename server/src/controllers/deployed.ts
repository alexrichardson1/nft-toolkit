import { RequestHandler } from "express";
import { User } from "models/user";

export const addDeployedAddress: RequestHandler = async (req, res) => {
  const { deployedAddress, fromAddress, collectionName } = req.params;
  const user = await User.findOne({
    fromAddress: fromAddress,
  }).exec();
  if (!user) {
    return res.json({ success: false, error: "Cannot find user" });
  }
  const collection = user.collections.find(
    (col) => col.name === collectionName
  );
  if (!collection) {
    return res.json({ success: false, error: "Cannot find collection" });
  }
  collection.address = deployedAddress;
  user.save().catch((err: Error) => {
    return res.json({ success: false, error: err.message });
  });
  return res.json({ success: true });
};
