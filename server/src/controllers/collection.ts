import { S3 } from "aws-sdk";
import dotenv from "dotenv";
import { BigNumber, ethers } from "ethers";
import { RequestHandler } from "express";
import multer from "multer";
import multerS3 from "multer-s3";
import { NFT__factory as NftFactory } from "../../smart-contracts/typechain";
import { Collection, CollectionT, Token } from "../models/collection";
import { User } from "../models/user";

dotenv.config();

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
      cbKey(null, `${file.fieldname}/images/${file.originalname}`);
    },
  }),
}).any();

type address = `0x${string}`;
interface UserT {
  fromAddress: address;
}

export const saveCollectionToDB: RequestHandler = async (req, _res, next) => {
  const userCollection: CollectionT & UserT = req.body;
  const { fromAddress } = userCollection;
  userCollection.tokens.map((token) => new Token(token));
  const collection = new Collection(userCollection);
  let user = await User.findOne({
    fromAddress: fromAddress,
  }).exec();

  if (user) {
    user.collections.push(collection);
  } else {
    user = new User({
      fromAddress: fromAddress,
      collections: [collection],
    });
  }
  user.save().catch((err: Error) => {
    next(err);
  });
  next();
};

export const deployContracts: RequestHandler = (req, res, next) => {
  const { name, symbol, tokens, price, fromAddress }: CollectionT & UserT =
    req.body;
  const signer = new ethers.VoidSigner(fromAddress);
  const NFTContract = new NftFactory(signer);
  const tx = NFTContract.getDeployTransaction(
    name,
    symbol,
    `http://nftoolkit.eu-west-2.elasticbeanstalk.com/${fromAddress}/${name}/`,
    tokens.length,
    BigNumber.from(price)
  );
  res.json({ transaction: tx });
  next();
};
