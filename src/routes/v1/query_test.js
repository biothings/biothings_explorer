const TRAPIGraphHandler = require("@biothings-explorer/query_graph_handler");
const swaggerValidation = require("../../middlewares/validate")
const path = require("path");
const smartAPIPath = path.resolve(__dirname, '../../../test/smartapi.json');
const { runTask, taskResponse, taskError } = require("../../controllers/threading/threadHandler");

class RouteQueryTest {
    setRoutes(app) {
        app.post('/test/query', swaggerValidation.validate, async (req, res, next) => {
            try {
                const response = await runTask(req, this.task, path.parse(__filename).name);
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify(response));
            } catch (error) {
                next(error);
            }
        });
    }

    async task(req) {
        try {
            const queryGraph = req.body.message.query_graph;
            const handler = new TRAPIGraphHandler.TRAPIQueryHandler({}, smartAPIPath, undefined, false);
            handler.setQueryGraph(queryGraph);
            await handler.query();
            taskResponse(handler.getResponse());
        } catch (error) {
            taskError(error);
        }
    }
}

module.exports = new RouteQueryTest();
