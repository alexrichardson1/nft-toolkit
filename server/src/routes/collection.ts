import { Router } from "express";
import { uploadImagesLocal } from "../controllers/collection";
// eslint-disable-next-line new-cap
const collectionRoutes = Router();

// TODO: Add uploadImagesS3, deployContracts, uploadDB
collectionRoutes.post("/", uploadImagesLocal);

export default collectionRoutes;
