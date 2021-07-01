const { fork } = require("child_process");
const { join } = require("path");
const ngrok = require("ngrok");

module.exports = class WebhooksListener {
  constructor() {
    this.hooksReceived = [];
  }

  async setup(port = 3005) {
    this.hooksServerProcess = fork(join(__dirname, "webhookServer.js"), [port]);

    const url = await ngrok.connect(port);

    this.hooksServerProcess.on("message", (message) => {
      this.hooksReceived.push(message);
    });

    process.on("exit", async function () {
      await this.stop();
    });

    return { url: `${url}/hooks`, processHandle: this.hooksServerProcess };
  }

  clearReceivedHooks() {
    this.hooksServerProcess.send({ clearHooks: true });
    this.hooksReceived = [];
  }

  async waitForNewHooks(timeToWait = 2000) {
    return Promise.race([
      new Promise((resolve, reject) => {
        this.hooksServerProcess.once("message", resolve);
      }),
      new Promise((resolve, reject) => {
        let wait = setTimeout(() => {
          clearTimeout(wait);
          resolve();
        }, timeToWait);
      }),
    ]);
  }

  async waitForHook(conditionFunc, timeToWait = 2000) {
    return Promise.race([
      new Promise((resolve, reject) => {
        this.hooksServerProcess.on("message", (message) => {
          const conditionResult = conditionFunc(message);
          if (conditionResult) {
            resolve(message);
          }
        });
      }),
      new Promise((resolve, reject) => {
        let wait = setTimeout(() => {
          clearTimeout(wait);
          resolve();
        }, timeToWait);
      }),
    ]);
  }

  async stop() {
    this.hooksServerProcess.kill("SIGKILL");
    await ngrok.kill();
  }
};
