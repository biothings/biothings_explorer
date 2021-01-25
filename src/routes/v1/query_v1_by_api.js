const TRAPIGraphHandler = require("../../controllers/QueryGraphHandler/index");
const swaggerValidation = require("../../middlewares/validate")

class RouteQueryV1ByAPI {
    setRoutes(app) {
        app.post('/v1/smartapi/:smartapi_id/query', swaggerValidation.validate, async (req, res, next) => {
            try {
                const queryGraph = req.body.message.query_graph;
                const handler = new TRAPIGraphHandler(req.params.smartapi_id, undefined, true);
                handler.setQueryGraph(queryGraph);
                await handler.query();
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(handler.getResponse()));
            }
            catch (error) {
                console.log(error);
                next(error);
            }
        });
    }
}

module.exports = new RouteQueryV1ByAPI();