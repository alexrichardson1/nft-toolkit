import { model, Schema } from "mongoose";

export interface UserCollectionI {
  address: string;
  chainId: number;
  image: string;
}

export interface UserT {
  _id: string;
  collections: UserCollectionI[];
}

const userCollectionSchema = new Schema<UserCollectionI>({
  address: String,
  chainId: Number,
  image: String,
});

const userSchema = new Schema<UserT>({
  _id: String,
  collections: [userCollectionSchema],
});

export const User = model("User", userSchema);
export const UserCollection = model("UserCollection", userCollectionSchema);
