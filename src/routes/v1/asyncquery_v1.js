const Queue = require('bull');
const path = require("path");
const axios = require('axios')
const redisClient = require('../../utils/cache/redis-client');
const config = require("./config");
const TRAPIGraphHandler = require("@biothings-explorer/query_graph_handler");
const swaggerValidation = require("../../middlewares/validate");
const smartAPIPath = path.resolve(__dirname, '../../../data/smartapi_specs.json');
const predicatesPath = path.resolve(__dirname, '../../../data/predicates.json');
const utils = require("../../utils/common");
const {asyncquery, asyncqueryResponse} = require('../../controllers/asyncquery')
const {getQueryQueue} = require('../../controllers/asyncquery_queue')
const URL = require("url").URL;

queryQueue = getQueryQueue('get query graph')

async function jobToBeDone(queryGraph, caching, workflow, callback_url){
    utils.validateWorkflow(workflow);
    const handler = new TRAPIGraphHandler.TRAPIQueryHandler({ apiNames: config.API_LIST, caching: caching }, smartAPIPath, predicatesPath);
    handler.setQueryGraph(queryGraph);
    return await asyncqueryResponse(handler, callback_url);
}

if(queryQueue){
    queryQueue.process(async (job) => {
        return jobToBeDone(job.data.queryGraph, job.data.caching, job.data.workflow, job.data.callback_url);
    });
}

class V1RouteAsyncQuery {
    setRoutes(app) {
        app.post('/v1/asyncquery', swaggerValidation.validate, async (req, res, next) => {
            // if I don't reinitialize this then the wrong queue will be used, not sure why this happens
            queryQueue = getQueryQueue('get query graph')

            let queueData = {
                queryGraph: req.body.message.query_graph,
                workflow: req.body.workflow,
                callback_url: req.body.callback_url || req.body['callback'],
                caching: req.query.caching
            }
            await asyncquery(req, res, next, queueData, queryQueue)
        });
    }
}



module.exports = new V1RouteAsyncQuery();
