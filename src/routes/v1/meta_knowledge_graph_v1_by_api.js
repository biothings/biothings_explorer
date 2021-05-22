const handler = require("../../controllers/meta_knowledge_graph");

class RouteMetaKGByAPI {
    setRoutes(app) {
        app.get('/v1/smartapi/:smartapiID/meta_knowledge_graph', async (req, res, next) => {
            try {
                const metaKGHandler = new handler(req.params.smartapiID);
                const kg = await metaKGHandler.getKG();
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(kg));
            } catch (error) {
                next(error)
            }
        })
    }
}

module.exports = new RouteMetaKGByAPI();