const express = require("express");
var cors = require("cors");
const { join } = require("path");

const hooksServer = express();
hooksServer.use("/static", express.static(join(__dirname, "public")));
let hooksServerPort = 3005;
let responseCode = 200;
let hooksPath = "/hooks";
let hooksRecieved = [];

if (process.argv.length > 2) {
  //args passed to process start in 3rd position
  hooksServerPort = process.argv[2];
}
process.on("message", function (message) {
  if (message.clearHooks) {
    hooksRecieved = [];
  }
});

hooksServer.use(express.json());
hooksServer.use(cors());

hooksServer.post(hooksPath, async (req, resp) => {
  const hookData = { recievedAt: Date(), headers: req.headers, body: req.body };
  resp.sendStatus(responseCode);
  hooksRecieved.push(hookData);
  process.send(hookData);
});

hooksServer.get(hooksPath, (req, resp) => {
  resp.send(JSON.stringify(hooksRecieved));
});

hooksServer.get("/", (req, resp) => {
  resp.sendFile(join(__dirname, "/public/index.html"));
});

hooksServer.listen(hooksServerPort, () => {
  console.log(`Listening for hooks at ${hooksPath} on ${hooksServerPort}`);
});
