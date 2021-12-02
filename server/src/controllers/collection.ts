import { s3 } from "@controllers/common";
import { GenCollectionI, generate } from "@controllers/generateArt";
import { Collection, CollectionT, Token } from "@models/collection";
import { User, UserCollectionI } from "@models/user";
import dotenv from "dotenv";
import { BigNumber, ethers } from "ethers";
import { RequestHandler } from "express";
import multer from "multer";
import multerS3 from "multer-s3";
import { NFT__factory as NftFactory } from "../../smart-contracts/typechain";

dotenv.config();

export const uploadImages = multer({
  storage: multerS3({
    s3: s3,
    bucket: "nft-toolkit-collections",
    acl: "public-read",
    key: function (_req, file, cbKey) {
      cbKey(null, `${file.fieldname}/images/${file.originalname}`);
    },
  }),
}).any();

export const successHandler: RequestHandler = (_req, res) =>
  res.json({ success: true });

export const saveCollectionToDB: RequestHandler = async (req, _res, next) => {
  const userCollection: CollectionT = req.body;
  userCollection.tokens.map((token) => new Token(token));
  const collection = new Collection(userCollection);
  await collection.save();
  next();
};

interface CollectionInfo {
  name: string;
  symbol: string;
  price: string;
}

export const deployContracts: RequestHandler = (req, res) => {
  const {
    name,
    symbol,
    tokens,
    price,
    creator,
    chainId,
  }: CollectionT & CollectionInfo = req.body;
  const signer = new ethers.VoidSigner(creator);
  const NFTContract = new NftFactory(signer);
  const tx = NFTContract.getDeployTransaction(
    name,
    symbol,
    `http://nftoolkit.eu-west-2.elasticbeanstalk.com/server/metadata/${chainId}/`,
    tokens.length,
    BigNumber.from(price)
  );
  tx.chainId = chainId;
  tx.from = creator;
  res.json({ transaction: tx });
};

const getCollectionsFromDB = async (
  creator: string
): Promise<UserCollectionI[]> => {
  const user = await User.findById(creator).exec();
  if (!user) {
    throw new Error("User not found");
  }
  return user.collections;
};

export const getUserCollections: RequestHandler = async (req, res, next) => {
  const { creator } = req.params;
  if (!creator) {
    return next(new Error("Invalid params"));
  }
  try {
    const collections = await getCollectionsFromDB(creator);
    return res.json({ collections });
  } catch (error) {
    return next(error);
  }
};

export const getCollectionFromDB = async (
  address: string,
  chainId: number
): Promise<CollectionT> => {
  const collection = await Collection.findOne({
    address,
    chainId,
  }).exec();
  if (!collection) {
    throw new Error("Collection not found");
  }
  return collection;
};

export const getCollection: RequestHandler = async (req, res, next) => {
  const { chainId, address } = req.params;
  if (!chainId || !address) {
    return next(new Error("Invalid params"));
  }
  try {
    const collection = await getCollectionFromDB(address, parseInt(chainId));
    return res.json({ collection });
  } catch (error) {
    return next(error);
  }
};

interface TierI {
  name: string;
  probability: string;
}

export const transformTiers: RequestHandler = (req, _res, next) => {
  const { tiers }: { tiers: TierI[] } = req.body;
  if (!tiers) {
    return next(new Error("Invalid params"));
  }
  let cumProbability = 0;

  const newTiers = tiers.map((tier) => {
    cumProbability += parseInt(tier.probability);
    return {
      name: tier.name,
      probability: cumProbability,
    };
  });
  req.body.tiers = newTiers;
  return next();
};

export const generateTokens: RequestHandler = async (req, _res, next) => {
  const genCollection: GenCollectionI = req.body;
  try {
    req.body.tokens = await generate(genCollection);
    next();
  } catch (error) {
    next(error);
  }
};
