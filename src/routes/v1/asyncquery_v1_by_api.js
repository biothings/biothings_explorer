const path = require("path");
const swaggerValidation = require("../../middlewares/validate");
const { asyncquery } = require("../../controllers/async/asyncquery");
const { getQueryQueue } = require("../../controllers/async/asyncquery_queue");
const utils = require("../../utils/common");
const { isMainThread } = require("worker_threads");

if (!global.queryQueue["bte_query_queue_by_api"] && isMainThread) {
  getQueryQueue("bte_query_queue_by_api");
  if (global.queryQueue["bte_query_queue_by_api"]) {
    global.queryQueue["bte_query_queue_by_api"].process(
      path.resolve(__dirname, "../../controllers/async/processors/async_v1_by_api.js"),
    );
  }
}

class V1RouteAsyncQueryByAPI {
  setRoutes(app) {
    app
      .route("/v1/smartapi/:smartapi_id/asyncquery")
      .post(swaggerValidation.validate, async (req, res, next) => {
        let queueData = {
          queryGraph: req.body.message.query_graph,
          smartAPIID: req.params.smartapi_id,
          workflow: req.body.workflow,
          callback_url: req.body.callback_url || req.body["callback"],
          options: { logLevel: req.body.log_level, submitter: req.body.submitter, schema: await utils.getSchema(), ...req.query },
          // enableIDResolution
        };
        await asyncquery(req, res, next, queueData, global.queryQueue["bte_query_queue_by_api"]);
      })
      .all(utils.methodNotAllowed);
  }
}

module.exports = new V1RouteAsyncQueryByAPI();
