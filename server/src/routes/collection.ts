import { Router } from "express";
import {
  saveCollectionToDB,
  uploadImagesLocal,
  uploadImagesS3,
} from "../controllers/collection";
// eslint-disable-next-line new-cap
const collectionRoutes = Router();

// TODO: Add deployContracts
collectionRoutes.post(
  "/",
  uploadImagesLocal,
  uploadImagesS3,
  saveCollectionToDB
);

export default collectionRoutes;
