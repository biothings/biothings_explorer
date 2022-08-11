const path = require("path");
const { API_LIST: apiList } = require("../../config/apis");
const TRAPIGraphHandler = require("@biothings-explorer/query_graph_handler");
const swaggerValidation = require("../../middlewares/validate");
const smartAPIPath = path.resolve(__dirname, process.env.STATIC_PATH ? `${process.env.STATIC_PATH}/data/smartapi_specs.json` : '../../../data/smartapi_specs.json');
const predicatesPath = path.resolve(__dirname, process.env.STATIC_PATH ? `${process.env.STATIC_PATH}/data/predicates.json` : '../../../data/predicates.json');
const utils = require("../../utils/common");
const { runTask, taskResponse, taskError } = require("../../controllers/threading/threadHandler");
const redisSyncLogging = require("../../middlewares/redis_sync_logging");
const redisLogger = require("../../controllers/redis_logger");

class V1RouteQuery {
    setRoutes(app) {
        app.post('/v1/query', redisSyncLogging.getMiddleware(), redisLogger.createMiddleware(redisLogger.logGeneralEndpointSync), swaggerValidation.validate, async (req, res, next) => {
            try {
                const response = await runTask(req, this.task, path.parse(__filename).name);
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify(response));
            } catch (err) {
                next(err);
            }
        });
    }

    async task(req) {
        try {
            utils.validateWorkflow(req.body.workflow);
            const queryGraph = req.body.message.query_graph;
            const handler = new TRAPIGraphHandler.TRAPIQueryHandler(
                { apiList, ...req.query },
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
