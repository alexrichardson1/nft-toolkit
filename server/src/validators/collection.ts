import { TokenT } from "@models/collection";
import { check, CustomValidator, ValidationChain } from "express-validator";

const areTokensValid: CustomValidator = (value: TokenT[]) => {
  return value.length > 0;
};

const invalidAddress = (address: string) =>
  check(address).isEthereumAddress().withMessage("Invalid address");

const invalidChainId = check("chainId")
  .isNumeric()
  .withMessage("Invalid chainId");

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
    invalidAddress("creator"),
    invalidChainId,
    check("layers").isArray(),
  ];
};

const invalidCollectionName = check("collectionName")
  .notEmpty()
  .isAlphanumeric(void 0, { ignore: " " })
  .withMessage("Invalid name, must be only alphanumeric");

export const deployedValidator: () => ValidationChain[] = () => {
  return [
    invalidAddress("fromAddress"),
    check("deployedAddress").isEthereumAddress().withMessage("Invalid address"),
    invalidCollectionName,
  ];
};

export const getCollectionsValidator: () => ValidationChain[] = () => {
  return [invalidAddress("creator")];
};

export const getCollectionValidator: () => ValidationChain[] = () => {
  return [
    invalidAddress("address"),
    check("chainId").isNumeric().withMessage("Invalid chainId"),
  ];
};
