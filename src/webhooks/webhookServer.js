const express = require("express");

const hooksServer = express();
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

hooksServer.post(hooksPath, async (req, resp) => {
  const hookData = { recievedAt: Date(), headers: req.headers, body: req.body };
  resp.sendStatus(responseCode);
  hooksRecieved.push(hookData);
  process.send(hookData);
});

hooksServer.get(hooksPath, (req, resp) => {
  resp.send(JSON.stringify(hooksRecieved));
});

hooksServer.listen(hooksServerPort, () => {
  console.log(`Listening for hooks at ${hooksPath} on ${hooksServerPort}`);
});
