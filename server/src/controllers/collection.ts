import multer from "multer";
import { createReadStream } from "fs";
import { PutObjectCommand, S3 } from "@aws-sdk/client-s3";
import path from "path";
import { NextFunction, Request, Response, RequestHandler } from "express";

export const uploadImagesLocal = multer({ dest: "uploads/" }).any();

// TODO: Complete CollectionT
interface CollectionT {
  name: string;
}

const s3 = new S3({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const uploadToBucket = (collection: string, filePath: string, id: number) => {
  const fileStream = createReadStream(filePath);
  const uploadParams = {
    Bucket: "nft-toolkit-collections",
    // Save the image to the collection folder using id to name it.
    Key: `${collection}/${id}${path.extname(filePath)}`,
    Body: fileStream,
  };
  s3.send(new PutObjectCommand(uploadParams));
};

export const uploadImagesS3: RequestHandler = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const collection: CollectionT = req.body;
  if (!req.files) {
    // TODO: Add error message?
    next();
  }
  const { files } = req;
  const fileArray = files as Express.Multer.File[];
  fileArray.map((file, id) =>
    uploadToBucket(collection.name, file.path, id + 1)
  );
  next();
};
