const utils = require("../utils/common");

class RouteFrontPage {
  setRoutes(app) {
    app
      .route("/")
      .get((req, res) => {
        res.redirect("https://smart-api.info/ui/dc91716f44207d2e1287c727f281d339");
      })
      .all(utils.methodNotAllowed);
  }
}

module.exports = new RouteFrontPage();
