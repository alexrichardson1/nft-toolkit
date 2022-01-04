import axios from "axios";
import { RequestHandler } from "express";

const RINKEBY_CHAIN_ID = 4;
const OPENSEA_API_URL = "https://testnets-api.opensea.io";

export const getMarketURL: RequestHandler = async (req, res, next) => {
  const { chainId, address } = req.params;
  if (!chainId || !address) {
    return next(new Error("Invalid params"));
  }

  const chainIdNum = parseInt(chainId);
  if (chainIdNum === RINKEBY_CHAIN_ID) {
    const openseaRes = await axios.get(
      `${OPENSEA_API_URL}/asset_contract/${address}`
    );
    const { slug } = openseaRes.data.collection;
    if (slug) {
      return res.json({
        marketURL: `${OPENSEA_API_URL}/collection/${slug}`,
      });
    }
  }
  return next(new Error("Collection not found"));
};
