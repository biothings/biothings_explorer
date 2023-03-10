const path = require("path");
const swaggerValidation = require("../../middlewares/validate");
const { asyncquery } = require("../../controllers/async/asyncquery");
const { getQueryQueue } = require("../../controllers/async/asyncquery_queue");
const utils = require("../../utils/common");
const { isMainThread } = require("worker_threads");

if (!global.queryQueue["bte_query_queue"] && isMainThread) {
  getQueryQueue("bte_query_queue");
  if (global.queryQueue["bte_query_queue"]) {
    global.queryQueue["bte_query_queue"].process(
      path.resolve(__dirname, "../../controllers/async/processors/async_v1.js"),
    );
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
          options: { logLevel: req.body.log_level, submitter: req.body.submitter, schema: await utils.getSchema(), ...req.query },
        };
        await asyncquery(req, res, next, queueData, global.queryQueue["bte_query_queue"]);
      })
      .all(utils.methodNotAllowed);
  }
}

module.exports = new V1RouteAsyncQuery();
