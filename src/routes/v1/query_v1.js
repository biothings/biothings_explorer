const path = require("path");
const config = require("./config");
const TRAPIGraphHandler = require("@biothings-explorer/query_graph_handler");
const swaggerValidation = require("../../middlewares/validate");
const smartAPIPath = path.resolve(__dirname, process.env.STATIC_PATH ? `${process.env.STATIC_PATH}/data/smartapi_specs.json` : '../../../data/smartapi_specs.json');
const predicatesPath = path.resolve(__dirname, process.env.STATIC_PATH ? `${process.env.STATIC_PATH}/data/predicates.json` : '../../../data/predicates.json');
const utils = require("../../utils/common");
const { runTask, taskResponse, taskError } = require("../../controllers/threading/threadHandler");


class V1RouteQuery {
    setRoutes(app) {
        app.post('/v1/query', swaggerValidation.validate, async (req, res, next) => {
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
                { apiList: config.API_LIST, caching: req.query.caching },
                smartAPIPath,
                predicatesPath,
            );
            handler.setQueryGraph(queryGraph);
            await handler.query();

            return taskResponse(handler.getResponse());
        } catch (error) {
            return taskError(error);
        }
    }
}



module.exports = new V1RouteQuery();
