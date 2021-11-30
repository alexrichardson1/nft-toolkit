import { S3 } from "aws-sdk";
import { RequestHandler } from "express";
import { validationResult } from "express-validator";

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
