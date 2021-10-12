import express from "express";
import cors from "cors";
const app = express();
const port = 5000; // default port to listen

const corsOptions = {
  origin: "http://localhost:3000",
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

// define a route handler for the default home page
app.get("/", (_req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.send("Hello world!");
});

// start the Express server
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
