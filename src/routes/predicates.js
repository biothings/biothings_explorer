const pred = require("../controllers/predicates");

class RoutePredicates {
    setRoutes(app) {
        app.get('/predicates', (req, res) => {
            try {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(pred()));
            } catch (error) {
                console.log(error);
                res.end();
            }
        })
    }
}

module.exports = new RoutePredicates();