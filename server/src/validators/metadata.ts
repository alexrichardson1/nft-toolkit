import { invalidAddress, invalidChainId } from "@validators/collection";
import { check, ValidationChain } from "express-validator";

export const metadataValidator: ValidationChain[] = [
  invalidChainId,
  invalidAddress("address"),
  check("tokenId").isNumeric(),
];
