import { Router as router } from "express";
import {
  deployContracts,
  saveCollectionToDB,
  uploadImages,
} from "../controllers/collection";

const collectionRoutes = router();

collectionRoutes.post("/save", saveCollectionToDB, deployContracts);

collectionRoutes.post("/images", uploadImages.any());

export default collectionRoutes;
