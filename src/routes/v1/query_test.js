const TRAPIGraphHandler = require("@biothings-explorer/query_graph_handler");
const swaggerValidation = require("../../middlewares/validate")
const path = require("path");
const smartAPIPath = path.resolve(__dirname, '../../../test/smartapi.json');
const runWorker = require("../../utils/threadWorker");

class RouteQueryTest {
    setRoutes(app) {
        app.post('/test/query', swaggerValidation.validate, async (req, res, next) => {
            try {
                const result = await runWorker({
                    req: { body: req.body },
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
            const queryGraph = req.body.message.query_graph;
            const handler = new TRAPIGraphHandler.TRAPIQueryHandler({}, smartAPIPath, undefined, false);
            handler.setQueryGraph(queryGraph);
            await handler.query();
            parentPort.postMessage({msg: handler.getResponse()});
        } catch (error) {
            parentPort.postMessage({err: error});
        }
    }
}

module.exports = new RouteQueryTest();
