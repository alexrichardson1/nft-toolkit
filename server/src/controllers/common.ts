import { RequestHandler } from "express";
import { validationResult } from "express-validator";

const ERROR_CODE = 400;

export const errorHandler: RequestHandler = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(ERROR_CODE).json({ errors: errors.array() });
  }
  return next();
};
