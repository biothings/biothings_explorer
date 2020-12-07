const PredicatesHandler = require("../controllers/predicates");

class RouteQueryByAPI {
    setRoutes(app) {
        app.get('/smartapi/:smartapiID/predicates', async (req, res, next) => {
            try {
                const handler = new PredicatesHandler(req.params.smartapiID, "0.9.2");
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

module.exports = new RouteQueryByAPI();