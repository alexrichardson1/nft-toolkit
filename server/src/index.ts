import collectionRoutes from "@routes/collection";
import metadataRoutes from "@routes/metadata";
import cors from "cors";
import express from "express";

const app = express();

const corsOptions = {
  origin: "http://localhost:3000",
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// Routes to handle requests
app.use("/collection", collectionRoutes);
app.use("/metadata", metadataRoutes);

// define a route handler for the default home page
app.get("/", (_req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.send("Hello world!");
});

export default app;
