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

if (!global.queryQueue.bte_query_queue_by_team && isMainThread) {
  getQueryQueue("bte_query_queue_by_team");
  if (global.queryQueue.bte_query_queue_by_team) {
    global.queryQueue.bte_query_queue_by_team.process(2, async job => {
      return await runBullTask(job, path.parse(__filename).name);
    });
  }
}

class V1RouteAsyncQueryByTeam {
  setRoutes(app) {
    app
      .route("/v1/team/:team_name/asyncquery")
      .post(swaggerValidation.validate, async (req, res, next) => {
        const queryGraph = req.body.message.query_graph;
        let queueData = {
          queryGraph: queryGraph,
          teamName: req.params.team_name,
          logLevel: req.body.log_level,
          workflow: req.body.workflow,
          callback_url: req.body.callback_url || req.body["callback"],
          options: {
            logLevel: req.body.log_level,
            submitter: req.body.submitter,
            ...req.query,
          },
          enableIDResolution: true,
        };
        await asyncquery(req, res, next, queueData, global.queryQueue["bte_query_queue_by_team"]);
      })
      .all(utils.methodNotAllowed);
  }

  async task(job) {
    const jobID = job.id,
      queryGraph = job.data.queryGraph,
      workflow = job.data.workflow,
      callback_url = job.data.callback_url,
      options = { ...job.data.options, schema: await utils.getSchema() },
      teamName = job.data.teamName,
      enableIDResolution = job.data.enableIDResolution,
      jobURL = job.data.url ?? null;

    global.queryInformation = {
      jobID,
      queryGraph,
      callback_url,
    };

    utils.validateWorkflow(workflow);
    const handler = new TRAPIQueryHandler(
      { apiList, teamName, enableIDResolution, ...options },
      smartAPIPath,
      predicatesPath,
    );
    handler.setQueryGraph(queryGraph);
    const result = await asyncqueryResponse(handler, callback_url, jobID, jobURL, queryGraph);
    taskResponse(result);
  }
}

module.exports = new V1RouteAsyncQueryByTeam();
