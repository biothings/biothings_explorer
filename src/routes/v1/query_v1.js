const path = require("path");
const config = require("./config");
const TRAPIGraphHandler = require("@biothings-explorer/query_graph_handler");
const swaggerValidation = require("../../middlewares/validate");
const smartAPIPath = path.resolve(__dirname, '../../../data/smartapi_specs.json');
const predicatesPath = path.resolve(__dirname, '../../../data/predicates.json');
const utils = require("../../utils/common");
const runWorker = require("../../utils/threadWorker");


class V1RouteQuery {
    setRoutes(app) {
        app.post('/v1/query', swaggerValidation.validate, async (req, res, next) => {
            //logger.info("query /query endpoint")
            try {
                const result = await runWorker({
                    req: { body: req.body, query: req.query },
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
            const handler = new TRAPIGraphHandler.TRAPIQueryHandler(
                { apiList: config.API_LIST, caching: req.query.caching },
                smartAPIPath,
                predicatesPath,
            );
            handler.setQueryGraph(queryGraph);
            await handler.query();

            parentPort.postMessage({msg: handler.getResponse()});
        } catch (error) {
            parentPort.postMessage({err: error});
        }
    }
}



module.exports = new V1RouteQuery();
