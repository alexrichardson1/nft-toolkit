import { errorHandler } from "@controllers/common";
import {
  getAllTokenMetadata,
  getCollectionMetadata,
  getTokenMetadata,
} from "@controllers/metadata";
import { invalidTokenId, metadataValidator } from "@validators/metadata";
import { Router as router } from "express";

const metadataRoutes = router();

metadataRoutes.get(
  "/:chainId/:address/contract/data",
  metadataValidator,
  errorHandler,
  getCollectionMetadata
);

metadataRoutes.get(
  "/:chainId/:address/:tokenId",
  metadataValidator,
  invalidTokenId,
  errorHandler,
  getTokenMetadata
);

metadataRoutes.get(
  "/:chainId/:address",
  metadataValidator,
  errorHandler,
  getAllTokenMetadata
);

export default metadataRoutes;
