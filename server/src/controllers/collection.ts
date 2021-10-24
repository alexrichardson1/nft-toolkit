import { S3 } from "aws-sdk";
import { ethers } from "ethers";
import { NextFunction, Request, RequestHandler, Response } from "express";
import multer from "multer";
import multerS3 from "multer-s3";
import { NFT__factory as NftFactory } from "../../smart-contracts/typechain";
import { Collection, Token } from "../models/collection";
import { User } from "../models/user";

const s3 = new S3({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export const uploadImages = multer({
  storage: multerS3({
    s3: s3,
    bucket: "nft-toolkit-collections",
    acl: "public-read",
    key: function (_req, file, cbKey) {
      cbKey(null, `${file.originalname}`);
    },
  }),
});

interface TokenT {
  name: string;
  description: string;
  image: string;
}

interface CollectionT {
  name: string;
  symbol: string;
  description: string;
  price: number;
  address?: string;
  tokens: TokenT[];
}

interface UserT {
  fromAddress: string;
}

export const saveCollectionToDB: RequestHandler = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const userCollection: CollectionT & UserT = req.body;
  userCollection.tokens.map((token) => new Token(token));
  const collection = new Collection(userCollection);
  let user = await User.findOne({
    fromAddress: userCollection.fromAddress,
  }).exec();
  if (user) {
    user.collections.push(collection);
  } else {
    user = new User({
      fromAddress: userCollection.fromAddress,
      collections: [collection],
    });
  }
  await user.save();
  // TODO: Add error handling
  next();
};

export const deployContracts: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const collection: CollectionT & UserT = req.body;
  const signer = new ethers.VoidSigner(collection.fromAddress);
  const NFTContract = new NftFactory(signer);
  const tx = NFTContract.getDeployTransaction(
    collection.name,
    collection.symbol,
    // TODO: baseURI link
    "",
    collection.tokens.length,
    collection.price
  );
  res.json({ transaction: tx });
  next();
};
