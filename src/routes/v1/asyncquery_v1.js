const path = require("path");
const swaggerValidation = require("../../middlewares/validate");
const { asyncquery, asyncqueryResponse } = require("../../controllers/async/asyncquery");
const { getQueryQueue } = require("../../controllers/async/asyncquery_queue");
const utils = require("../../utils/common");
const { isMainThread } = require("worker_threads");
const { TRAPIQueryHandler } = require("@biothings-explorer/query_graph_handler");
const { API_LIST: apiList } = require("../../config/apis");
const { taskResponse, runBullTask } = require("../../controllers/threading/threadHandler");
const smartAPIPath = path.resolve(
  __dirname,
  process.env.STATIC_PATH ? `${process.env.STATIC_PATH}/data/smartapi_specs.json` : "../../../data/smartapi_specs.json",
);
const predicatesPath = path.resolve(
  __dirname,
  process.env.STATIC_PATH ? `${process.env.STATIC_PATH}/data/predicates.json` : "../../../data/predicates.json",
);

if (!global.queryQueue.bte_query_queue && isMainThread) {
  getQueryQueue("bte_query_queue");
  if (global.queryQueue.bte_query_queue) {
    global.queryQueue.bte_query_queue.process(async job => {
      return await runBullTask(job, path.parse(__filename).name);
    });
    // path.resolve(__dirname, "../../controllers/async/processors/async_v1.js"),
  }
}

class V1RouteAsyncQuery {
  setRoutes(app) {
    app
      .route("/v1/asyncquery")
      .post(swaggerValidation.validate, async (req, res, next) => {
        let queueData = {
          queryGraph: req.body.message.query_graph,
          workflow: req.body.workflow,
          callback_url: req.body.callback_url || req.body["callback"],
          options: {
            logLevel: req.body.log_level,
            submitter: req.body.submitter,
            ...req.query,
          },
        };
        await asyncquery(req, res, next, queueData, global.queryQueue["bte_query_queue"]);
      })
      .all(utils.methodNotAllowed);
  }

  async task(job) {
    const jobID = job.id,
      queryGraph = job.data.queryGraph,
      workflow = job.data.workflow,
      callback_url = job.data.callback_url,
      options = { ...job.data.options, schema: await utils.getSchema() },
      jobURL = job.data.url ?? null;

    global.queryInformation = {
      jobID,
      queryGraph,
      callback_url,
    };

    utils.validateWorkflow(workflow);
    const handler = new TRAPIQueryHandler({ apiList, ...options }, smartAPIPath, predicatesPath);
    handler.setQueryGraph(queryGraph);
    const result = await asyncqueryResponse(handler, callback_url, jobID, jobURL, queryGraph);
    taskResponse(result);
  }
}

module.exports = new V1RouteAsyncQuery();
