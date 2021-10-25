import { Router as router } from "express";
import { getTokenMetadata } from "../controllers/metadata";

const metadataRoutes = router();

metadataRoutes.get("/:fromAddress/:collectionName/:tokenId", getTokenMetadata);

export default metadataRoutes;
