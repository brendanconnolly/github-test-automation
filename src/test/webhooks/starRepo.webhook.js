const githubClient = require("../../api/githubClient");
const ReposService = require("../../api/reposService");
const ActivityService = require("../../api/activityService");
const WebhookListener = require("../../webhooks/webhookListener");
const expect = require("chai").expect;

describe("Star Repo Webhook", function () {
  const hookListener = new WebhookListener();
  const repoSvc = new ReposService(githubClient.instance);
  const activitySvc = new ActivityService(githubClient.instance);
  const starHooksFilter = (hook) => hook.headers["x-github-event"] == "star";
  let webhookCreatedId;

  before(async () => {
    const hookConfig = await hookListener.setup(3006);
    const webhookResponse = await repoSvc.createWebhook(hookConfig.url, [
      "star",
    ]);
    webhookCreatedId = webhookResponse.data.id;
  });

  beforeEach(() => {
    hookListener.clearReceivedHooks();
  });

  after(async () => {
    await repoSvc.deleteWebhook(webhookCreatedId);
    await hookListener.stop();
  });

  it("should be received when a repo is starred", async () => {
    await activitySvc.unstarRepository();
    await hookListener.waitForNewHooks();
    hookListener.clearReceivedHooks();

    await activitySvc.starRepository();

    await hookListener.waitForHook(starHooksFilter);
    const starHooksRecieved =
      hookListener.hooksReceived.filter(starHooksFilter);

    expect(starHooksRecieved).to.have.lengthOf(1);
    expect(starHooksRecieved[0].body.action).to.eq("created");
  });

  it("should be received when a repo is unstarred", async () => {
    await activitySvc.starRepository();
    await hookListener.waitForNewHooks();
    hookListener.clearReceivedHooks();

    await activitySvc.unstarRepository();

    await hookListener.waitForHook(starHooksFilter);
    const starHooksRecieved =
      hookListener.hooksReceived.filter(starHooksFilter);

    expect(starHooksRecieved).to.have.lengthOf(1);
    expect(starHooksRecieved[0].body.action).to.eq("deleted");
  });
});
