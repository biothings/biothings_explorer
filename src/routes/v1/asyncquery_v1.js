const path = require("path");
const swaggerValidation = require("../../middlewares/validate");
const { asyncquery } = require("../../controllers/async/asyncquery");
const { getQueryQueue } = require("../../controllers/async/asyncquery_queue");
const utils = require("../../utils/common");

class V1RouteAsyncQuery {
  setRoutes(app) {
    app
      .route("/v1/asyncquery")
      .post(swaggerValidation.validate, async (req, res, next) => {
        if (!global.QueryQueue) {
          global.QueryQueue = getQueryQueue("bte_query_queue");
          global.QueryQueue.process(path.resolve(__dirname, "../../controllers/async/processors/async_v1.js"));
        }

        let queueData = {
          queryGraph: req.body.message.query_graph,
          workflow: req.body.workflow,
          callback_url: req.body.callback_url || req.body["callback"],
          options: { logLevel: req.body.log_level, submitter: req.body.submitter, ...req.query },
        };
        await asyncquery(req, res, next, queueData, global.QueryQueue);
      })
      .all(utils.methodNotAllowed);
  }
}

module.exports = new V1RouteAsyncQuery();
