const TRAPIGraphHandler = require("@biothings-explorer/query_graph_handler");
const swaggerValidation = require("../../middlewares/validate")
const path = require("path");
const smartAPIPath = path.resolve(__dirname, '../../../data/smartapi_specs.json');
const predicatesPath = path.resolve(__dirname, '../../../data/predicates.json');
const utils = require("../../utils/common");
const runWorker = require("../../utils/threadWorker");

class RouteQueryV1ByAPI {
    setRoutes(app) {
        app.post('/v1/smartapi/:smartapi_id/query', swaggerValidation.validate, async (req, res, next) => {
            try {
                const result = await runWorker({
                    req: { body: req.body, query: req.query, params: req.params },
                    route: path.parse(__filename).name,
                });
                if (result.err) {
                    next(result.err);
                } else {
                    res.setHeader("Content-Type", "application/json");
                    res.end(JSON.stringify(result.msg));
                }
            } catch (error) {
                next(error);
            }
        });
    }

    async workerHandler(req, parentPort) {
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
            parentPort.postMessage({msg: handler.getResponse()});
        } catch (error) {
            parentPort.postMessage({err: error});
        }
    }
}

module.exports = new RouteQueryV1ByAPI();
