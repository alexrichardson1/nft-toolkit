import {
  deployContracts,
  getCollection,
  getCollections,
  saveCollectionToDB,
  successHandler,
  uploadImages,
} from "@controllers/collection";
import { errorHandler } from "@controllers/common";
import { addDeployedAddress } from "@controllers/deployed";
import {
  collectionValidator,
  deployedValidator,
  getCollectionsValidator,
  getCollectionValidator,
} from "@validators/collection";
import { Router as router } from "express";

const collectionRoutes = router();

collectionRoutes.post(
  "/save",
  collectionValidator(),
  errorHandler,
  saveCollectionToDB,
  deployContracts
);

collectionRoutes.post("/images", uploadImages, successHandler);

collectionRoutes.post(
  "/deployed/:fromAddress/:collectionName/:deployedAddress",
  deployedValidator(),
  errorHandler,
  addDeployedAddress
);

collectionRoutes.get(
  "/:fromAddress",
  getCollectionsValidator(),
  errorHandler,
  getCollections
);

collectionRoutes.get(
  "/:fromAddress/:collectionName",
  getCollectionValidator(),
  errorHandler,
  getCollection
);

export default collectionRoutes;
