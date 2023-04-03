const path = require("path");
const { API_LIST: apiList } = require("../../config/apis");
const TRAPIGraphHandler = require("@biothings-explorer/query_graph_handler");
const swaggerValidation = require("../../middlewares/validate");
const smartAPIPath = path.resolve(
  __dirname,
  process.env.STATIC_PATH ? `${process.env.STATIC_PATH}/data/smartapi_specs.json` : "../../../data/smartapi_specs.json",
);
const predicatesPath = path.resolve(
  __dirname,
  process.env.STATIC_PATH ? `${process.env.STATIC_PATH}/data/predicates.json` : "../../../data/predicates.json",
);
const utils = require("../../utils/common");
const { runTask, taskResponse, taskError } = require("../../controllers/threading/threadHandler");
const { isMainThread } = require("worker_threads");
const { getQueryQueue } = require("../../controllers/async/asyncquery_queue");

class V1RouteQuery {
  setRoutes(app) {
    app
      .route("/v1/query")
      .post(swaggerValidation.validate, async (req, res, next) => {
        try {
          // req.schema = await utils.getSchema();
          const response = await runTask(req, this.task, path.parse(__filename).name, res);
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(response));
        } catch (err) {
          next(err);
        }
      })
      .all(utils.methodNotAllowed);
  }

  async task(job) {
    const queryGraph = job.data.queryGraph,
      workflow = job.data.workflow,
      options = { ...job.data.options, schema: await utils.getSchema() };
    try {
      utils.validateWorkflow(workflow);
      const handler = new TRAPIGraphHandler.TRAPIQueryHandler({ apiList, ...options }, smartAPIPath, predicatesPath);
      handler.setQueryGraph(queryGraph);
      await handler.query();

      const response = handler.getResponse();
      utils.filterForLogLevel(response, options.logLevel);
      return taskResponse(response);
    } catch (error) {
      return taskError(error);
    }
  }
}

module.exports = new V1RouteQuery();
