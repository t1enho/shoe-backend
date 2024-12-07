import bodyParser from "body-parser";
import * as dotenv from "dotenv";
import express from "express";
import * as admin from "firebase-admin";
import routes from "~/routes";
const firebasekey = require("./firebase-key.json");

admin.initializeApp({ credential: admin.credential.cert(firebasekey) });

dotenv.config();

const port = 6000;

const app = express();

app.use(express.json());

app.use(
  bodyParser.json({
    limit: "50mb",
  })
);
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
  })
);

app.use("/api/", routes);

// start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
