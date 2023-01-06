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

class V1RouteQuery {
  setRoutes(app) {
    app
      .route("/v1/query")
      .post(swaggerValidation.validate, async (req, res, next) => {
        try {
          req.schema = await utils.getSchema();
          const response = await runTask(req, this.task, path.parse(__filename).name);
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(response));
        } catch (err) {
          next(err);
        }
      })
      .all(utils.methodNotAllowed);
  }

  async task(req) {
    try {
      utils.validateWorkflow(req.body.workflow);
      const queryGraph = req.body.message.query_graph;
      const handler = new TRAPIGraphHandler.TRAPIQueryHandler(
        { apiList, ...req.query, submitter: req.body.submitter, schema: req.schema },
        smartAPIPath,
        predicatesPath,
      );
      handler.setQueryGraph(queryGraph);
      await handler.query();

      const response = handler.getResponse();
      utils.filterForLogLevel(response, req.body.log_level);
      return taskResponse(response);
    } catch (error) {
      return taskError(error);
    }
  }
}

module.exports = new V1RouteQuery();
