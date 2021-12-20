const TRAPIGraphHandler = require("@biothings-explorer/query_graph_handler");
const swaggerValidation = require("../../middlewares/validate")
const path = require("path");
const smartAPIPath = path.resolve(__dirname, process.env.STATIC_PATH ? `${process.env.STATIC_PATH}/data/smartapi_specs.json` : '../../../data/smartapi_specs.json');
const predicatesPath = path.resolve(__dirname, process.env.STATIC_PATH ? `${process.env.STATIC_PATH}/data/predicates.json` : '../../../data/predicates.json');
const utils = require("../../utils/common");
const { runTask, taskResponse, taskError } = require("../../controllers/threading/threadHandler");

class RouteQueryV1ByAPI {
    setRoutes(app) {
        app.post('/v1/smartapi/:smartapi_id/query', swaggerValidation.validate, async (req, res, next) => {
            try {
                const response = await runTask(req, this.task, path.parse(__filename).name);
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify(response));
            } catch (error) {
                next(error);
            }
        });
    }

    async task(req) {
        try {
            utils.validateWorkflow(req.body.workflow);
            const queryGraph = req.body.message.query_graph;
            const enableIDResolution = (['5be0f321a829792e934545998b9c6afe', '978fe380a147a8641caf72320862697b'].includes(req.params.smartapi_id)) ? false : true;
            const handler = new TRAPIGraphHandler.TRAPIQueryHandler(
                {
                    smartAPIID: req.params.smartapi_id,
                    caching: req.query.caching,
                    enableIDResolution
                },
                smartAPIPath,
                predicatesPath,
                false
            );
            handler.setQueryGraph(queryGraph);
            await handler.query();
            return taskResponse(handler.getResponse());
        } catch (error) {
            return taskError(error);
        }
    }
}

module.exports = new RouteQueryV1ByAPI();
