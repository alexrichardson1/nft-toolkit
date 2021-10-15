import mongoose from "mongoose";

// TODO: add attributes to collectible schema
const tokenSchema = new mongoose.Schema({
  name: String,
  description: String,
  image: String,
});

// TODO: complete collection schema - description?
const collectionSchema = new mongoose.Schema({
  name: String,
  symbol: String,
  tokens: [tokenSchema],
});

export const Token = mongoose.model("Token", tokenSchema);
export const Collection = mongoose.model("Collection", collectionSchema);
