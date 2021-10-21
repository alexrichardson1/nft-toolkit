import express from "express";
import cors from "cors";
import collectionRoutes from "./routes/collection";

const app = express();

const corsOptions = {
  origin: "http://localhost:3000",
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Routes to handle requests
app.use("/collection", collectionRoutes);

// define a route handler for the default home page
app.get("/", (_req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.send("Hello world!");
});

export default app;
