const path = require("path");
const swaggerValidation = require("../../middlewares/validate");
const { asyncquery } = require("../../controllers/async/asyncquery");
const { getQueryQueue } = require("../../controllers/async/asyncquery_queue");
const utils = require("../../utils/common");

class V1RouteAsyncQueryByTeam {
  setRoutes(app) {
    app
      .route("/v1/team/:team_name/asyncquery")
      .post(swaggerValidation.validate, async (req, res, next) => {
        if (!global.queryQueueByTeam) {
          global.queryQueueByTeam = getQueryQueue("bte_query_queue_by_team");
          global.queryQueueByTeam.process(
            path.resolve(__dirname, "../../controllers/async/processors/async_v1_by_team.js"),
          );
        }
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
        await asyncquery(req, res, next, queueData, global.queryQueueByTeam);
      })
      .all(utils.methodNotAllowed);
  }
}

module.exports = new V1RouteAsyncQueryByTeam();
