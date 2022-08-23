const path = require("path");
const swaggerValidation = require("../../middlewares/validate");
const { asyncquery } = require('../../controllers/async/asyncquery')
const { getQueryQueue } = require('../../controllers/async/asyncquery_queue')
const { redisLogger } = require("../../controllers/redis_logger")

queryQueue = getQueryQueue('bte_query_queue')

if (queryQueue) {
    queryQueue.process(path.resolve(__dirname, "../../controllers/async/processors/async_v1.js"));
}

class V1RouteAsyncQuery {
    setRoutes(app) {
        app.post('/v1/asyncquery', redisLogger.createMiddleware(redisLogger.logGeneralEndpointAsync), swaggerValidation.validate, async (req, res, next) => {
            // if I don't reinitialize this then the wrong queue will be used, not sure why this happens
            queryQueue = getQueryQueue('bte_query_queue')

            let queueData = {
                queryGraph: req.body.message.query_graph,
                workflow: req.body.workflow,
                callback_url: req.body.callback_url || req.body['callback'],
                options: { logLevel: req.body.log_level, ...req.query }
            }
            await asyncquery(req, res, next, queueData, queryQueue)
        });
    }
}



module.exports = new V1RouteAsyncQuery();
