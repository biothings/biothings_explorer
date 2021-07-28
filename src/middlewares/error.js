const swaggerValidation = require('./validate');
const QueryGraphHandler = require("@biothings-explorer/query_graph_handler");
const PredicatesLoadingError = require('../utils/errors/predicates_error');
const MetaKGLoadingError = require("../utils/errors/metakg_error");
const debug = require("debug")("bte:biothings-explorer-trapi:error_handler");
class ErrorHandler {
    setRoutes(app) {
        app.use((error, req, res, next) => {
            if (error instanceof swaggerValidation.InputValidationError) {
                return res.status(400).json({
                    error: "Your input query graph is invalid",
                    more_info: error.errors
                });
            }
            if (error instanceof QueryGraphHandler.InvalidQueryGraphError) {
                return res.status(400).json({
                    error: "Your input query graph is invalid",
                    more_info: error.message
                })
            }
            if (error instanceof PredicatesLoadingError) {
                return res.status(404).json({
                    error: "Unable to load predicates",
                    more_info: error.message
                })
            }

            if (error instanceof MetaKGLoadingError) {
                return res.status(404).json({
                    error: "Unable to load metakg",
                    more_info: error.message
                })
            }
            if (!error.statusCode) error.statusCode = 500;

            if (error.statusCode === 301) {
                return res.status(301).redirect('/');
            }
            debug(error);
            return res
                .status(error.statusCode)
                .json({
                    message: {
                        query_graph: req.body.message.query_graph,
                        knowledge_graph: { nodes: {}, edges: {} },
                        results: []    
                    },
                    status: error.statusCode,
                    description: error.toString() 
                });
        });
    }
}

module.exports = new ErrorHandler();