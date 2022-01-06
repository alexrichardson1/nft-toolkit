import { TokenT } from "@models/collection";
import { S3 } from "aws-sdk";
import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import { MIN_IMG_UPLOAD } from "./generateArt";

export const ERROR_CODE = 400;

export const errorHandler: RequestHandler = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(ERROR_CODE).json({ errors: errors.array() });
  }
  return next();
};

export const s3 = new S3({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export const SITE_URL = "http://nftoolkit.eu-west-2.elasticbeanstalk.com";

const MIDPOINT = 0.5;

export const shuffleTokens = (tokens: TokenT[]): TokenT[] =>
  tokens.slice(0, MIN_IMG_UPLOAD).sort(() => MIDPOINT - Math.random());
