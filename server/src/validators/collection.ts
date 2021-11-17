import { TokenT } from "@models/collection";
import { check, CustomValidator, ValidationChain } from "express-validator";

const areTokensValid: CustomValidator = (value: TokenT[]) => {
  return value.length > 0;
};

export const collectionValidator: () => ValidationChain[] = () => {
  return [
    check("name")
      .notEmpty()
      .isAlphanumeric(void 0, { ignore: " " })
      .withMessage("Invalid name, must be only alphanumeric"),
    check("symbol").notEmpty().isAlphanumeric(),
    check("description").notEmpty().escape(),
    check("price").isNumeric(),
    check("tokens")
      .custom(areTokensValid)
      .withMessage("Must have at least one NFT in collection."),
    check("fromAddress").isEthereumAddress().withMessage("Invalid address"),
  ];
};

export const deployedValidator: () => ValidationChain[] = () => {
  return [
    check("fromAddress").isEthereumAddress().withMessage("Invalid address"),
    check("deployedAddress").isEthereumAddress().withMessage("Invalid address"),
    check("collectionName")
      .notEmpty()
      .isAlphanumeric()
      .withMessage("Invalid name, must be only alphanumeric"),
  ];
};

export const getCollectionsValidator: () => ValidationChain[] = () => {
  return [
    check("fromAddress").isEthereumAddress().withMessage("Invalid address"),
  ];
};
