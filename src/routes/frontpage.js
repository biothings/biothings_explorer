const utils = require("../utils/common");
const history = require("connect-history-api-fallback");
const express = require("express");
const path = require("path");

class RouteFrontPage {
  setRoutes(app) {
    const staticFileMiddleware = express.static(path.resolve(__dirname, "../web-app/dist"));
    app.use(staticFileMiddleware).all(utils.methodNotAllowed);
    app.use(
      history({
        disableDotRule: true,
      }),
    ).all(utils.methodNotAllowed);
    app.use(staticFileMiddleware).all(utils.methodNotAllowed);
  }
}

module.exports = new RouteFrontPage();
