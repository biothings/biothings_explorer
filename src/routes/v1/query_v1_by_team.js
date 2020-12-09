const TRAPIGraphHandler = require("../../controllers/QueryGraphHandler/index");
const swaggerValidation = require("../../middlewares/validate")

class RouteQueryV1ByTeam {
    setRoutes(app) {
        app.post('/v1/team/:teamName/query', swaggerValidation.validate, async (req, res, next) => {
            try {
                const queryGraph = req.body.message.query_graph;
                const handler = new TRAPIGraphHandler(undefined, req.params.teamName);
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

module.exports = new RouteQueryV1ByTeam();