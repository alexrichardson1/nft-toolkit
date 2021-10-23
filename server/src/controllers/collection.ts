import { PutObjectCommand, S3 } from "@aws-sdk/client-s3";
import { ethers } from "ethers";
import { NextFunction, Request, RequestHandler, Response } from "express";
import { createReadStream } from "fs";
import multer from "multer";
import path from "path";
import { NFT__factory as NftFactory } from "../../smart-contracts/typechain";
import { Collection, Token } from "../models/collection";
import { User } from "../models/user";

export const uploadImagesLocal = multer({ dest: "uploads/" }).any();

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

const s3 = new S3({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const uploadToBucket = (collection: string, filePath: string, id: number) => {
  const fileStream = createReadStream(filePath);
  const imageKey = `${collection}/${id}${path.extname(filePath)}`;
  const uploadParams = {
    Bucket: "nft-toolkit-collections",
    // Save the image to the collection folder using id to name it.
    Key: imageKey,
    Body: fileStream,
    ACL: "public-read",
  };
  s3.send(new PutObjectCommand(uploadParams));
  const imageURL = `https://nft-toolkit-collections.s3.eu-west-2.amazonaws.com/${imageKey}`;
  return imageURL;
};

export const uploadImagesS3: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const collection: CollectionT = req.body;
  const { files } = req;
  if (!files) {
    return next(new Error("File array undefined"));
  }
  const fileArray = files as Express.Multer.File[];
  const imageURLs = fileArray.map((file, id) =>
    uploadToBucket(collection.name, file.path, id + 1)
  );
  res.json({ images: imageURLs });
  return next();
};

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
