const path = require("path");
const swaggerValidation = require("../../middlewares/validate");
const { asyncquery } = require("../../controllers/async/asyncquery");
const { getQueryQueue } = require("../../controllers/async/asyncquery_queue");
const utils = require("../../utils/common");
const { isMainThread } = require("worker_threads");

if (!global.queryQueue["bte_query_queue_by_team"] && isMainThread) {
  getQueryQueue("bte_query_queue_by_team");
  if (global.queryQueue["bte_query_queue_by_team"]) {
    global.queryQueue["bte_query_queue_by_team"].process(
      path.resolve(__dirname, "../../controllers/async/processors/async_v1_by_team.js"),
    );
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
          options: { logLevel: req.body.log_level, submitter: req.body.submitter, ...req.query },
          enableIDResolution: true,
        };
        await asyncquery(req, res, next, queueData, global.queryQueue["bte_query_queue_by_team"]);
      })
      .all(utils.methodNotAllowed);
  }
}

module.exports = new V1RouteAsyncQueryByTeam();
