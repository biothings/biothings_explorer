const path = require("path");
const config = require("./config");
const TRAPIGraphHandler = require("@biothings-explorer/query_graph_handler");
const swaggerValidation = require("../../middlewares/validate");
const smartAPIPath = path.resolve(__dirname, '../../../data/smartapi_specs.json');
const predicatesPath = path.resolve(__dirname, '../../../data/predicates.json');
const utils = require("../../utils/common");

class V1RouteQuery {
    setRoutes(app) {
        app.post('/v1/query', swaggerValidation.validate, async (req, res, next) => {
            //logger.info("query /query endpoint")
            try {
                utils.validateWorkflow(req.body.workflow);
                const queryGraph = req.body.message.query_graph;
                const handler = new TRAPIGraphHandler.TRAPIQueryHandler({ apiList: config.API_LIST, caching: req.query.caching }, smartAPIPath, predicatesPath);
                handler.setQueryGraph(queryGraph);
                await handler.query_2();
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(handler.getResponse()));
            }
            catch (error) {
                next(error);
            }
        });
    }
}

module.exports = new V1RouteQuery();
