const Queue = require('bull');
const path = require("path");
const axios = require('axios');
const { nanoid } = require('nanoid');
const redisClient = require('../../utils/cache/redis-client');
const config = require("./config");
const TRAPIGraphHandler = require("@biothings-explorer/query_graph_handler");
const swaggerValidation = require("../../middlewares/validate");
const smartAPIPath = path.resolve(__dirname, '../../../data/smartapi_specs.json');
const predicatesPath = path.resolve(__dirname, '../../../data/predicates.json');
const utils = require("../../utils/common");
const {asyncquery, asyncqueryResponse} = require('../../controllers/asyncquery');
const {getQueryQueue} = require('../../controllers/asyncquery_queue');

queryQueue = getQueryQueue('get query graph by api')

async function jobToBeDone(queryGraph, smartAPIID, caching, enableIDResolution, workflow, webhook_url){
    utils.validateWorkflow(workflow);
    const handler = new TRAPIGraphHandler.TRAPIQueryHandler(
        {
            smartAPIID,
            caching,
            enableIDResolution
        },
        smartAPIPath,
        predicatesPath,
        false
    );
    handler.setQueryGraph(queryGraph);
    return await asyncqueryResponse(handler, webhook_url);
}

if(queryQueue){
    queryQueue.process(async (job) => {
        return jobToBeDone(
            job.data.queryGraph,
            job.data.smartAPIID,
            job.data.caching,
            job.data.enableIDResolution,
            job.data.workflow,
            job.data.webhook_url);
    });
}

class V1RouteAsyncQueryByAPI {
    setRoutes(app) {
        app.post('/v1/smartapi/:smartapi_id/asyncquery', swaggerValidation.validate, async (req, res, next) => {
            queryQueue = getQueryQueue('get query graph by api')

            const enableIDResolution = (['5be0f321a829792e934545998b9c6afe', '978fe380a147a8641caf72320862697b'].includes(req.params.smartapi_id)) ? false : true;
            let queueData = {
                queryGraph: req.body.message.query_graph,
                smartAPIID: req.params.smartapi_id,
                caching: req.query.caching,
                workflow: req.body.workflow,
                webhook_url: req.body.callback_url || req.body['callback'],
                enableIDResolution
            }
            await asyncquery(req, res, next, queueData, queryQueue)
        });
    }
}



module.exports = new V1RouteAsyncQueryByAPI();
