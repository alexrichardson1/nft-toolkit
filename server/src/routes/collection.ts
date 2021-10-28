import { addDeployedAddress } from "controllers/deployed";
import { Router as router } from "express";
import {
  deployContracts,
  getCollections,
  saveCollectionToDB,
  uploadImages,
} from "../controllers/collection";
import { errorHandler } from "../controllers/common";
import { collectionValidator } from "../validators/collection";

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
  addDeployedAddress
);

collectionRoutes.get("/:fromAddress", getCollections);

export default collectionRoutes;
