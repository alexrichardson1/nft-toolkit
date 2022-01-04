import { errorHandler } from "@controllers/common";
import { getMarketURL } from "@controllers/market";
import { metadataValidator } from "@validators/metadata";
import { Router as router } from "express";

const marketRoutes = router();

marketRoutes.get(
  "/:chainId/:address",
  metadataValidator,
  errorHandler,
  getMarketURL
);

export default marketRoutes;
