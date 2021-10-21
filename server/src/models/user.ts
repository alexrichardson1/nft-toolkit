import { model, Schema } from "mongoose";
import { collectionSchema } from "./collection";

// TODO: add attributes to collectible schema
const userSchema = new Schema({
  fromAddress: String,
  collections: [collectionSchema],
});

export const User = model("User", userSchema);
