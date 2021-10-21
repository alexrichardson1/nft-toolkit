import { model, Schema } from "mongoose";

// TODO: add attributes to collectible schema
const tokenSchema = new Schema({
  name: String,
  description: String,
  image: String,
});

// TODO: complete collection schema - contract address?
const collectionSchema = new Schema({
  name: String,
  description: String,
  symbol: String,
  tokens: [tokenSchema],
});

export const Token = model("Token", tokenSchema);
export const Collection = model("Collection", collectionSchema);
