const PredicatesHandler = require("../../controllers/predicates");

class RoutePredicatesByAPI {
    setRoutes(app) {
        app.get('/v1/smartapi/:smartapiID/meta_knowledge_graph', async (req, res, next) => {
            try {
                const handler = new PredicatesHandler(req.params.smartapiID);
                const predicates = await handler.getPredicates();
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(predicates));
            }
            catch (error) {
                next(error);
            }
        });
    }
}

module.exports = new RoutePredicatesByAPI();