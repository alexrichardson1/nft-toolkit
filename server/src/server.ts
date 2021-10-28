import db from "@controllers/database";
import app from "@server/index";

// default port to listen
const port = 5000;
db.connect();

// start the Express server
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
