const path = require("path");
const swaggerValidation = require("../../middlewares/validate");
const { asyncquery } = require('../../controllers/async/asyncquery');
const { getQueryQueue } = require('../../controllers/async/asyncquery_queue');
const redisLogger = require("../../controllers/redis_logger");

queryQueue = getQueryQueue('bte_query_queue_by_team')

if (queryQueue) {
    queryQueue.process(path.resolve(__dirname, "../../controllers/async/processors/async_v1_by_team.js"));
}

class V1RouteAsyncQueryByTeam {
    setRoutes(app) {
        app.post('/v1/team/:team_name/asyncquery', redisLogger.createMiddleware(redisLogger.logSpecificEndpointAsync), swaggerValidation.validate, async (req, res, next) => {
            queryQueue = getQueryQueue('bte_query_queue_by_team')
            const queryGraph = req.body.message.query_graph;
            // const enableIDResolution = (req.params.team_name === "Text Mining Provider") ? false : true;
            let queueData = {
                queryGraph: queryGraph,
                teamName: req.params.team_name,
                logLevel: req.body.log_level,
                workflow: req.body.workflow,
                callback_url: req.body.callback_url || req.body['callback'],
                options: { logLevel: req.body.log_level, ...req.query },
                enableIDResolution: true
            }
            await asyncquery(req, res, next, queueData, queryQueue)
        });
    }
}



module.exports = new V1RouteAsyncQueryByTeam();
