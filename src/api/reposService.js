const githubClient = require("./githubClient");
const repositoryName = process.env.TEST_REPOSITORY_NAME;
const repositoryOwner = process.env.TEST_REPOSITORY_OWNER;

class ReposService {
  async createWebhook(hookUrl, events, contentType = "json") {
    return await githubClient.instance.repos.createWebhook({
      owner: repositoryOwner,
      repo: repositoryName,
      config: {
        url: hookUrl,
        content_type: contentType,
      },
      events: events,
    });
  }

  async deleteWebhook(hookId) {
    return await githubClient.instance.repos.deleteWebhook({
      owner: repositoryOwner,
      repo: repositoryName,
      hook_id: hookId,
    });
  }

  async listWebhooks() {
    return await githubClient.instance.repos.listWebhooks({
      owner: repositoryOwner,
      repo: repositoryName,
    });
  }
}

module.exports = ReposService;
