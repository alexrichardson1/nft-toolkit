import {
  deployContracts,
  getCollections,
  saveCollectionToDB,
  uploadImages,
} from "@controllers/collection";
import { errorHandler } from "@controllers/common";
import { addDeployedAddress } from "@controllers/deployed";
import {
  collectionValidator,
  deployedValidator,
  getCollectionsValidator,
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

collectionRoutes.post("/images", uploadImages);

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

export default collectionRoutes;
