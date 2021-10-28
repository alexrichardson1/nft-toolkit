import { ERROR_CODE } from "@controllers/common";
import { User } from "@models/user";
import { RequestHandler } from "express";

export const addDeployedAddress: RequestHandler = async (req, res) => {
  const { deployedAddress, fromAddress, collectionName } = req.params;
  const user = await User.findOne({
    fromAddress: fromAddress,
  }).exec();
  if (!user) {
    return res.status(ERROR_CODE).send("Sorry can't find that user");
  }
  const collection = user.collections.find(
    (col) => col.name === collectionName
  );
  if (!collection) {
    return res.status(ERROR_CODE).send("Sorry can't find that collection");
  }
  collection.address = deployedAddress;
  user.save().catch((err: Error) => {
    return res.status(ERROR_CODE).send(err.message);
  });
  return res.json({ success: true });
};
