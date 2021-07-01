require("dotenv").config();
const { Octokit } = require("@octokit/rest");

class GithubClient {
  constructor() {
    this.instance = new Octokit({ auth: process.env.GITHUB_TOKEN });
  }
}

module.exports = new GithubClient();
