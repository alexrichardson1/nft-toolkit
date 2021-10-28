import { model, Schema } from "mongoose";

export interface TokenT {
  name: string;
  description: string;
  image: string;
}

export interface CollectionT {
  name: string;
  symbol: string;
  description: string;
  price: string;
  address?: string;
  tokens: TokenT[];
}

// TODO: add attributes to collectible schema
const tokenSchema = new Schema<TokenT>({
  name: String,
  description: String,
  image: String,
});

// TODO: complete collection schema - contract address?
export const collectionSchema = new Schema<CollectionT>({
  name: String,
  description: String,
  address: String,
  symbol: String,
  price: String,
  tokens: [tokenSchema],
});

export const Token = model("Token", tokenSchema);
export const Collection = model("Collection", collectionSchema);
