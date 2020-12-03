const swaggerValidation = require('openapi-validator-middleware');
const InvalidQueryGraphError = require("../utils/errors/invalid_query_graph_error");

class ErrorHandler {
    setRoutes(app) {
        app.use((error, req, res, next) => {
            if (error instanceof swaggerValidation.InputValidationError) {
                return res.status(400).json({
                    error: "Your input query graph is invalid",
                    more_info: error.errors
                });
            }
            if (error instanceof InvalidQueryGraphError) {
                return res.status(400).json({
                    error: "Your input query graph is invalid",
                    more_info: error.message
                })
            }
            if (!error.statusCode) error.statusCode = 500;

            if (error.statusCode === 301) {
                return res.status(301).redirect('/');
            }

            return res
                .status(error.statusCode)
                .json({ error: error.toString() });
        });
    }
}

module.exports = new ErrorHandler();