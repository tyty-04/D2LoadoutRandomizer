const fs = require("fs");
const key = fs.readFileSync("./localhost-key.pem");
const cert = fs.readFileSync("./localhost.pem");
const path = require("path");

const express = require("express");
var cors = require("cors");
const app = express();
app.use(cors({ credentials: true, origin: true }));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const https = require("https");
const server = https.createServer({ key, cert }, app);

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});

app.use(express.static(path.join(__dirname, "build")));

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});