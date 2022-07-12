const handler = require("../../controllers/meta_knowledge_graph");
const utils = require("../../utils/common");

class RouteMetaKGByTeam {
  setRoutes(app) {
    app
      .route("/v1/team/:teamName/meta_knowledge_graph")
      .get(async (req, res, next) => {
        try {
          const metaKGHandler = new handler(undefined, req.params.teamName);
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

module.exports = new RouteMetaKGByTeam();
