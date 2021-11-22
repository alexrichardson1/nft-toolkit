import { model, Schema } from "mongoose";

interface AttributeI {
  [key: string]: string;
}

export interface TokenT {
  name: string;
  description: string;
  image: string;
  attributes: AttributeI;
}

interface LayerI {
  name: string;
  variants: string[];
}

export interface CollectionT {
  creator: string;
  description: string;
  chainId: number;
  address?: string;
  tokens: TokenT[];
  layers: LayerI[];
}

const tokenSchema = new Schema<TokenT>({
  name: String,
  description: String,
  image: String,
  attributes: {
    type: Map,
    of: String,
  },
});

const layerSchema = new Schema<LayerI>({
  name: String,
  variants: [String],
});

export const collectionSchema = new Schema<CollectionT>({
  creator: String,
  description: String,
  address: String,
  chainId: Number,
  tokens: [tokenSchema],
  layers: [layerSchema],
});

export const Token = model("Token", tokenSchema);
export const Collection = model("Collection", collectionSchema);
