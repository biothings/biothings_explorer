const swaggerValidation = require("./validate");
const QueryGraphHandler = require("@biothings-explorer/query_graph_handler");
const PredicatesLoadingError = require("../utils/errors/predicates_error");
const MetaKGLoadingError = require("../utils/errors/metakg_error");
const ServerOverloadedError = require("../utils/errors/server_overloaded_error");
const debug = require("debug")("bte:biothings-explorer-trapi:error_handler");
class ErrorHandler {
  setRoutes(app) {
    app.use((error, req, res, next) => {
      if (error instanceof swaggerValidation.InputValidationError || error.name === "InputValidationError") {
        return res.status(400).json({
          error: "Your input query graph is invalid",
          more_info: error.errors,
        });
      }
      // read stack when instance or err is broken
      if (
        error instanceof QueryGraphHandler.InvalidQueryGraphError ||
        error.stack.includes("InvalidQueryGraphError") ||
        error.name === "InvalidQueryGraphError"
      ) {
        return res.status(400).json({
          error: "Your input query graph is invalid",
          more_info: error.message,
        });
      }
      if (error instanceof PredicatesLoadingError || error.name === "PredicatesLoadingError") {
        return res.status(404).json({
          error: "Unable to load predicates",
          more_info: error.message,
        });
      }

      if (error instanceof MetaKGLoadingError || error.name === "MetaKGLoadingError") {
        return res.status(404).json({
          error: "Unable to load metakg",
          more_info: error.message,
        });
      }

      if (error instanceof ServerOverloadedError || error.name === "ServerOverloadedError") {
        return res.status(503).set("Retry-After", error.retryAfter).json({
          error: "Server is overloaded",
          more_info: error.message,
        });
      }
      if (!error.statusCode) error.statusCode = 500;

      if (error.statusCode === 301) {
        return res.status(301).redirect("/");
      }
      debug(error);
      return res.status(error.statusCode).json({
        message: {
          query_graph: req.body?.message?.query_graph,
          knowledge_graph: { nodes: {}, edges: {} },
          results: [],
        },
        status: error.statusCode,
        description: error.toString(),
        trace: process.env.NODE_ENV === "production" ? undefined : error.stack,
      });
    });
  }
}

module.exports = new ErrorHandler();
