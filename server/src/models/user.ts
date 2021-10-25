import { model, Schema } from "mongoose";
import { collectionSchema, CollectionT } from "./collection";

interface UserT {
  fromAddress: string;
  collections: CollectionT[];
}

// TODO: add attributes to collectible schema
const userSchema = new Schema<UserT>({
  fromAddress: String,
  collections: [collectionSchema],
});

export const User = model("User", userSchema);
