const TRAPIGraphHandler = require("../controllers/QueryGraphHandler/index");

class RouteQueryV1ByAPI {
    setRoutes(app) {
        app.post('/v1/smartapi/:smartapiID/query', async (req, res, next) => {
            try {
                const queryGraph = req.body.message.query_graph;
                const handler = new TRAPIGraphHandler(req.params.smartapiID);
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

module.exports = new RouteQueryV1ByAPI();