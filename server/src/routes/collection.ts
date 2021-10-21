import { Router as router } from "express";
import {
  deployContracts,
  saveCollectionToDB,
  uploadImagesLocal,
  uploadImagesS3,
} from "../controllers/collection";

const collectionRoutes = router();

collectionRoutes.post(
  "/",
  uploadImagesLocal,
  uploadImagesS3,
  saveCollectionToDB,
  deployContracts
);

export default collectionRoutes;
