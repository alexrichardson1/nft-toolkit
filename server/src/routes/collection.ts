import { Router } from "express";
import { uploadImagesLocal, uploadImagesS3 } from "../controllers/collection";
// eslint-disable-next-line new-cap
const collectionRoutes = Router();

// TODO: Add deployContracts, uploadDB
collectionRoutes.post("/", uploadImagesLocal, uploadImagesS3);

export default collectionRoutes;
