const TRAPIGraphHandler = require("@biothings-explorer/query_graph_handler");
const swaggerValidation = require("../../middlewares/validate")
const path = require("path");
const smartAPIPath = path.resolve(__dirname, '../../../test/smartapi.json');

class RouteQueryTest {
    setRoutes(app) {
        app.post('/test/query', swaggerValidation.validate, async (req, res, next) => {
            try {
                const queryGraph = req.body.message.query_graph;
                const handler = new TRAPIGraphHandler.TRAPIQueryHandler({}, smartAPIPath, undefined, false);
                handler.setQueryGraph(queryGraph);
                await handler.query();
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(handler.getResponse()));
            }
            catch (error) {
                next(error);
            }
        });
    }
}

module.exports = new RouteQueryTest();