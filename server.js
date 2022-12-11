const fs = require("fs");
const key = fs.readFileSync("./localhost-key.pem");
const cert = fs.readFileSync("./localhost.pem");

const express = require("express");
var cors = require("cors");
const app = express();
app.use(cors({ credentials: true, origin: true }));

const https = require("https");
const server = https.createServer({ key, cert }, app);

const port = 5000;
server.listen(port, () => {
  console.log(`Server is listening on https://localhost:${port}`);
});
