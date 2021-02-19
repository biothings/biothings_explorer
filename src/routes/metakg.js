const utils = require("../utils/common");
const assoc = require("../controllers/association");
const MetaKGLoadingError = require("../utils/errors/metakg_error");

class RouteMetaKG {
    setRoutes(app) {
        app.get('/metakg', async (req, res, next) => {
            try {
                res.setHeader('Content-Type', 'application/json');
                let api = undefined, source = undefined;
                if (req.query.api !== undefined) {
                    api = utils.removeQuotesFromQuery(req.query.api);
                }
                if (req.query.provided_by !== undefined) {
                    source = utils.removeQuotesFromQuery(req.query.provided_by);
                }
                let assocs = await assoc(req.query.subject, req.query.object, req.query.predicate, api, source);
                res.end(JSON.stringify({ associations: assocs }));
            } catch (error) {
                next(
                    new MetaKGLoadingError());
            }
        })
    }
}

module.exports = new RouteMetaKG();