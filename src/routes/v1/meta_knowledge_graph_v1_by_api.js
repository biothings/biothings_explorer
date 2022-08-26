const handler = require("../../controllers/meta_knowledge_graph");
const utils = require("../../utils/common");

class RouteMetaKGByAPI {
  setRoutes(app) {
    app
      .route("/v1/smartapi/:smartapiID/meta_knowledge_graph")
      .get(async (req, res, next) => {
        try {
          const metaKGHandler = new handler(req.params.smartapiID);
          const kg = await metaKGHandler.getKG();
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(kg));
        } catch (error) {
          next(error);
        }
      })
      .all(utils.methodNotAllowed);
  }
}

module.exports = new RouteMetaKGByAPI();
