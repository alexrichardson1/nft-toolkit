import {
  deployContracts,
  generateTokens,
  getCollection,
  getUserCollections,
  saveCollectionToDB,
  successHandler,
  transformTiers,
  uploadImages,
} from "@controllers/collection";
import { errorHandler } from "@controllers/common";
import { addDeployedAddress } from "@controllers/deployed";
import {
  collectionValidator,
  deployedValidator,
  getCollectionsValidator,
  getCollectionValidator,
  invalidLayers,
  invalidTokens,
} from "@validators/collection";
import { Router as router } from "express";

const collectionRoutes = router();

collectionRoutes.post(
  "/save",
  collectionValidator,
  invalidTokens,
  errorHandler,
  saveCollectionToDB,
  deployContracts
);

collectionRoutes.post(
  "/save-gen",
  collectionValidator,
  invalidLayers,
  errorHandler,
  transformTiers,
  generateTokens,
  saveCollectionToDB,
  deployContracts
);

collectionRoutes.post("/images", uploadImages, successHandler);

collectionRoutes.post(
  "/deployed/:creator/:chainId/:address",
  deployedValidator,
  errorHandler,
  addDeployedAddress
);

collectionRoutes.get(
  "/:creator",
  getCollectionsValidator,
  errorHandler,
  getUserCollections
);

collectionRoutes.get(
  "/:chainId/:address",
  getCollectionValidator,
  errorHandler,
  getCollection
);

export default collectionRoutes;
