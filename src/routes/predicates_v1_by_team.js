const PredicatesHandler = require("../controllers/predicates");

class RoutePredicatesByTeam {
    setRoutes(app) {
        app.get('/v1/team/:teamName/predicates', async (req, res, next) => {
            try {
                const handler = new PredicatesHandler(undefined, "1.0.0", req.params.teamName);
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

module.exports = new RoutePredicatesByTeam();