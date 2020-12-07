const handler = require("../controllers/predicates");

class RoutePredicates {
    setRoutes(app) {
        app.get('/v1/predicates', async (req, res) => {
            try {
                const predicateHandler = new handler(undefined, "1.0.0");
                const predicates = await predicateHandler.getPredicates();
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(predicates));
            } catch (error) {
                console.log(error);
                res.end();
            }
        })
    }
}

module.exports = new RoutePredicates();