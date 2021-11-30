import { model, Schema } from "mongoose";

export interface AttributeI {
  ["trait_type"]: string;
  ["value"]: string;
}

export interface TokenT {
  name: string;
  description: string;
  image: string;
  attributes: AttributeI[];
}

export interface CollectionT {
  creator: string;
  description: string;
  chainId: number;
  address?: string;
  tokens: TokenT[];
}

const tokenSchema = new Schema<TokenT>({
  name: String,
  description: String,
  image: String,
  attributes: [
    {
      type: Map,
      of: String,
    },
  ],
});

export const collectionSchema = new Schema<CollectionT>({
  creator: String,
  description: String,
  address: String,
  chainId: Number,
  tokens: [tokenSchema],
});

export const Token = model("Token", tokenSchema);
export const Collection = model("Collection", collectionSchema);
