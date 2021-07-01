const githubClient = require("./githubClient");
const repositoryName = process.env.TEST_REPOSITORY_NAME;
const repositoryOwner = process.env.TEST_REPOSITORY_OWNER;

class ActivityService {
  async starRepository() {
    return await githubClient.instance.activity.starRepoForAuthenticatedUser({
      owner: repositoryOwner,
      repo: repositoryName,
    });
  }

  async unstarRepository() {
    return await githubClient.instance.activity.unstarRepoForAuthenticatedUser({
      owner: repositoryOwner,
      repo: repositoryName,
    });
  }
}

module.exports = ActivityService;
