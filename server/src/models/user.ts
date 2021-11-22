import { model, Schema } from "mongoose";

interface CollectionI {
  address: string;
  chainId: number;
}

export interface UserT {
  _id: string;
  collections: CollectionI[];
}

const collectionSchema = new Schema<CollectionI>({
  address: String,
  chainId: Number,
});

const userSchema = new Schema<UserT>({
  _id: String,
  collections: [collectionSchema],
});

export const User = model("User", userSchema);
