const TRAPIGraphHandler = require("@biothings-explorer/query_graph_handler");
const swaggerValidation = require("../../middlewares/validate");
const path = require("path");
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
const { API_LIST: apiList } = require("../../config/apis");

class RouteQueryV1ByAPI {
  setRoutes(app) {
    app
      .route("/v1/smartapi/:smartapi_id/query")
      .post(swaggerValidation.validate, async (req, res, next) => {
        try {
          req.schema = await utils.getSchema();
          const response = await runTask(req, this.task, path.parse(__filename).name);
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(response));
        } catch (error) {
          next(error);
        }
      })
      .all(utils.methodNotAllowed);
  }

  async task(req) {
    try {
      utils.validateWorkflow(req.body.workflow);
      const queryGraph = req.body.message.query_graph;
      // Disabled the disabling of text-mining / multiomics provider APIs -- we're not sure why they were disabled in the first place...
      // const enableIDResolution = (['5be0f321a829792e934545998b9c6afe', '978fe380a147a8641caf72320862697b'].includes(req.params.smartapi_id)) ? false : true;
      const handler = new TRAPIGraphHandler.TRAPIQueryHandler(
        {
          apiList,
          smartAPIID: req.params.smartapi_id,
          submitter: req.body.submitter,
          ...req.query,
          schema: req.schema
          // enableIDResolution
        },
        smartAPIPath,
        predicatesPath,
        false,
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

module.exports = new RouteQueryV1ByAPI();
