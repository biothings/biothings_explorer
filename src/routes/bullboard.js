const { getQueryQueue } = require("../controllers/async/asyncquery_queue");
const { createBullBoard } = require("@bull-board/api");
const { BullAdapter } = require("@bull-board/api/bullAdapter");
const { ExpressAdapter } = require("@bull-board/express");
const path = require("path");
const debug = require("debug")("bte:biothings-explorer-trapi:bullboard");
const { redisClient } = require("@biothings-explorer/query_graph_handler");

class RouteBullBoardPage {
  setRoutes(app) {
    debug("Initializing Bull Dashboard");
    if (!redisClient.clientEnabled || process.env.INTERNAL_DISABLE_REDIS) {
      debug("Redis is not enabled, disabling Bull Dashboard");
      app.use("/queues", async (req, res, next) => {
        res
          .status(503)
          .set("Retry-After", 600)
          .set("Content-Type", "application/json")
          .end(JSON.stringify({ error: "Redis service is unavailable, so async job queuing is disabled." }));
      });
      return;
    }
    const queues = {
      "/v1/asyncquery": getQueryQueue("bte_query_queue"),
      "/v1/smartapi/{smartapi_id}/asyncquery": getQueryQueue("bte_query_queue_by_api"),
      "/v1/team/{team_name}/asyncquery": getQueryQueue("bte_query_queue_by_team"),
    };

    const serverAdapter = new ExpressAdapter();
    serverAdapter.setBasePath("/queues");

    const instance = {
      prod: "Prod",
      test: "Test",
      ci: "Staging",
      dev: "Dev",
    }[process.env.INSTANCE_ENV ?? "dev"];

    const { addQueue, removeQueue, setQueues, replaceQueues } = createBullBoard({
      queues: Object.entries(queues).map(([name, queue]) => {
        const adapter = new BullAdapter(queue, {
          readOnlyMode: true,
          description: name,
        });
        adapter.setFormatter("name", job => `Asynchronous Request #${job.id}`);
        adapter.setFormatter("data", ({ worker, ...rest }) => rest);
        return adapter;
      }),
      serverAdapter,
      options: {
        uiConfig: {
          boardTitle: `BTE ${instance}`,
        },
      },
    });

    app.use("/queues", serverAdapter.getRouter());
  }
}

module.exports = new RouteBullBoardPage();
