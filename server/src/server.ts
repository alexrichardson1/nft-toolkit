import app from "./index";

// default port to listen
const port = 5000;

// start the Express server
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
