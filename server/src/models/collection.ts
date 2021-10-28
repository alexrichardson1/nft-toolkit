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
  chainId: number;
  address?: string;
  tokens: TokenT[];
}

// TODO: add attributes to collectible schema
const tokenSchema = new Schema<TokenT>({
  name: String,
  description: String,
  image: String,
});

export const collectionSchema = new Schema<CollectionT>({
  name: String,
  description: String,
  address: String,
  symbol: String,
  price: String,
  chainId: Number,
  tokens: [tokenSchema],
});

export const Token = model("Token", tokenSchema);
export const Collection = model("Collection", collectionSchema);
