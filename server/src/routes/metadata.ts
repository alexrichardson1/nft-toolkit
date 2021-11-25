import { errorHandler } from "@controllers/common";
import { getTokenMetadata } from "@controllers/metadata";
import { metadataValidator } from "@validators/metadata";
import { Router as router } from "express";

const metadataRoutes = router();

metadataRoutes.get(
  "/:chainId/:address/:tokenId",
  metadataValidator,
  errorHandler,
  getTokenMetadata
);

export default metadataRoutes;
