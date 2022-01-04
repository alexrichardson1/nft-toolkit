import { Collection } from "@models/collection";
import { User } from "@models/user";
import axios from "axios";
import { RequestHandler } from "express";

const RINKEBY_CHAIN_ID = 4;

interface OpenSeaInfo {
  slug: string;
}

interface OpenSeaCol {
  collection?: OpenSeaInfo;
}

export const getMarketURL: RequestHandler = async (req, res, next) => {
  const { chainId, address } = req.params;
  if (!chainId || !address) {
    return next(new Error("Invalid params"));
  }

  const chainIdNum = parseInt(chainId);
  if (chainIdNum !== RINKEBY_CHAIN_ID) {
    return next(new Error("Invalid chainId"));
  }
  try {
    const openseaRes = await axios.get(
      `https://testnets-api.opensea.io/asset_contract/${address}`
    );
    const { collection: openseaCollection }: OpenSeaCol = openseaRes.data;
    if (!openseaCollection) {
      return next("Collection not found");
    }
    const marketURL = `https://testnets.opensea.io/collection/${openseaCollection.slug}`;
    const collection = await Collection.findOneAndUpdate(
      { address, chainId: chainIdNum },
      { marketURL },
      {
        returnOriginal: false,
      }
    ).exec();
    if (!collection) {
      throw new Error("Collection not found");
    }
    const { creator } = collection;
    await User.findOneAndUpdate(
      { _id: creator, "collections.address": address },
      { $set: { "collections.$.marketURL": marketURL } }
    ).exec();
    return res.json({
      marketURL,
    });
  } catch (error) {
    return next(error);
  }
};
