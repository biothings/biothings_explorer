const path = require("path");
const config = require("./config");
const TRAPIGraphHandler = require("@biothings-explorer/query_graph_handler");
const swaggerValidation = require("../../middlewares/validate");
const smartAPIPath = path.resolve(__dirname, '../../../data/smartapi_specs.json');
const predicatesPath = path.resolve(__dirname, '../../../data/predicates.json');
const utils = require("../../utils/common");
const { workerData, isMainThread, parentPort, Worker } = require("worker_threads");

function runWorker(req) {
    return new Promise((resolve, reject) => {
        const worker = new Worker(path.resolve(__dirname, "./query_v1.js"), {workerData: req});
        worker.on("message", resolve);
        worker.on("error", reject);
        worker.on("exit", code => {
          if (code !== 0) {
            reject(new Error(`Worker exited with code ${code}`));
          }
        });
    });
}


class V1RouteQuery {
    setRoutes(app) {
        app.post('/v1/query', swaggerValidation.validate, async (req, res, next) => {
            //logger.info("query /query endpoint")
            try {
                const result = await runWorker({body: req.body, query: req.query});
                 if (result.err) {
                     next(result.err);
                 } else {
                    res.setHeader("Content-Type", "application/json");
                    res.end(JSON.stringify(result));
                 }
            } catch (error) {
                next(error);
            }
        });
    }
}

async function workerHandler() {
    try {
        const req = workerData;
        utils.validateWorkflow(req.body.workflow);
        const queryGraph = req.body.message.query_graph;
        const handler = new TRAPIGraphHandler.TRAPIQueryHandler(
            { apiList: config.API_LIST, caching: req.query.caching },
            smartAPIPath,
            predicatesPath,
        );
        handler.setQueryGraph(queryGraph);
        await handler.query_2();

        parentPort.postMessage(handler.getResponse());
    } catch (error) {
         parentPort.postMessage(error);
    }
}

if (!isMainThread) {
    workerHandler();
}

module.exports = new V1RouteQuery();
