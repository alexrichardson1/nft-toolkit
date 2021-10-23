import { Router as router } from "express";
import {
  deployContracts,
  saveCollectionToDB,
  uploadImagesLocal,
  uploadImagesS3,
} from "../controllers/collection";

const collectionRoutes = router();

collectionRoutes.post("/save", saveCollectionToDB, deployContracts);

collectionRoutes.post("/images", uploadImagesLocal, uploadImagesS3);

export default collectionRoutes;
