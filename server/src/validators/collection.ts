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

const invalidFromAddress = check("fromAddress")
  .isEthereumAddress()
  .withMessage("Invalid address");

const invalidCollectionName = check("collectionName")
  .notEmpty()
  .isAlphanumeric(void 0, { ignore: " " })
  .withMessage("Invalid name, must be only alphanumeric");

export const deployedValidator: () => ValidationChain[] = () => {
  return [
    invalidFromAddress,
    check("deployedAddress").isEthereumAddress().withMessage("Invalid address"),
    invalidCollectionName,
  ];
};

export const getCollectionsValidator: () => ValidationChain[] = () => {
  return [invalidFromAddress];
};

export const getCollectionValidator: () => ValidationChain[] = () => {
  return [invalidFromAddress, invalidCollectionName];
};
