const TRAPIGraphHandler = require("../../controllers/QueryGraphHandler/index");
const swaggerValidation = require("../../middlewares/validate")

class RouteQueryV1ByAPI {
    setRoutes(app) {
        app.post('/v1/smartapi/:smartapi_id/query', swaggerValidation.validate, async (req, res, next) => {
            try {
                const queryGraph = req.body.message.query_graph;
                const enableIDResolution = (['5be0f321a829792e934545998b9c6afe', '978fe380a147a8641caf72320862697b'].includes(req.params.smartapi_id)) ? false : true;
                const handler = new TRAPIGraphHandler(req.params.smartapi_id, undefined, enableIDResolution);
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