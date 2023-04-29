const handler = require("../../controllers/meta_knowledge_graph");
const utils = require("../../utils/common");
const swaggerValidation = require("../../middlewares/validate");

class RouteMetaPath {
  setRoutes(app) {
    app
      .route("/v1/meta_knowledge_path")
      .post(swaggerValidation.validate, async (req, res, next) => {
        try {
          const metaKGHandler = new handler(undefined);
          console.log('here')
          const result = await metaKGHandler.findPath(req.body);
          console.log(result)
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(result));
        } catch (error) {
          next(error);
        }
      })
      .all(utils.methodNotAllowed);
  }
}

module.exports = new RouteMetaPath();
