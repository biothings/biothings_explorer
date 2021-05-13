const handler = require("../../controllers/predicates");

class RoutePredicates {
    setRoutes(app) {
        app.get('/v1/meta_knowledge_graph', async (req, res, next) => {
            try {
                const predicateHandler = new handler(undefined);
                const predicates = await predicateHandler.getPredicates();
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(predicates));
            } catch (error) {
                next(error)
            }
        })
    }
}

module.exports = new RoutePredicates();