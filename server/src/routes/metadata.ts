import { getTokenMetadata } from "@controllers/metadata";
import { Router as router } from "express";

const metadataRoutes = router();

metadataRoutes.get("/:fromAddress/:collectionName/:tokenId", getTokenMetadata);

export default metadataRoutes;
