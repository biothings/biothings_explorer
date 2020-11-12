const assoc = require("../controllers/association");

class RouteMetaKG {
    setRoutes(app) {
        app.get('/metakg', async (req, res) => {
            try {
                res.setHeader('Content-Type', 'application/json');
                let api = undefined, source = undefined;
                if (req.query.api !== undefined) {
                    if (req.query.api.startsWith('"') && req.query.api.endsWith('"')) {
                        api = req.query.api.slice(1, -1);
                    } else {
                        api = req.query.api;
                    }
                }
                if (req.query.provided_by !== undefined) {
                    if (req.query.provided_by.startsWith('"') && req.query.provided_by.endsWith('"')) {
                        source = req.query.provided_by.slice(1, -1);
                    } else {
                        source = req.query.provided_by;
                    }
                }
                let assocs = await assoc(req.query.subject, req.query.object, req.query.predicate, api, source);
                res.end(JSON.stringify(assocs));
            } catch (error) {
                console.log(error);
                res.end();
            }
        })
    }
}

module.exports = new RouteMetaKG();