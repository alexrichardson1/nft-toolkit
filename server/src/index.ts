import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import collectionRoutes from "./routes/collection";

dotenv.config();
const app = express();
// default port to listen
const port = 5000;

const corsOptions = {
  origin: "http://localhost:3000",
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

mongoose.connect(process.env.DB_URI);

// Routes to handle requests
app.use("/collection", collectionRoutes);

// define a route handler for the default home page
app.get("/", (_req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.send("Hello world!");
});

// start the Express server
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
