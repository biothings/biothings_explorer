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
const {asyncquery} = require('../../controllers/asyncquery')
const {getQueryQueue} = require('../../controllers/asyncquery_queue')
const URL = require("url").URL;

queryQueue = getQueryQueue('get query graph')

async function jobToBeDone(queryGraph, caching, workflow, webhook_url){
    utils.validateWorkflow(workflow);
    const handler = new TRAPIGraphHandler.TRAPIQueryHandler({ apiNames: config.API_LIST, caching: caching }, smartAPIPath, predicatesPath);
    handler.setQueryGraph(queryGraph);
    let response = null
    try{
        await handler.query_2();
        response = handler.getResponse();
    }catch (e){
        console.error(e)
        return {
            response: response,
            status: 400,
            callback: ''
        }
    }
    if(webhook_url){
        if(!utils.stringIsAValidUrl(webhook_url)){
            return {
                response: response,
                status: 200,
                callback: 'The callback url must be a valid url'
            }
        }
        try{
            const res = await axios.post(webhook_url, JSON.stringify(response), {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            //console.log(res)
        }catch (e){
            return {
                response: response,
                status: 200,
                callback: `Request failed, received code ${e.response.status}`
            }
        }
    }else{
        return {
            response: response,
            status: 200,
            callback: 'Callback url was not provided'
        };
    }
    return {
        response: response,
        status: 200,
        callback: 'Data sent to callback url'
    };
}

if(queryQueue){
    queryQueue.process(async (job) => {
        return jobToBeDone(job.data.queryGraph, job.data.caching, job.data.workflow, job.data.webhook_url);
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
                webhook_url: req.body.callback_url || req.body['callback'],
                caching: req.query.caching
            }
            await asyncquery(req, res, next, queueData, queryQueue)
        });
    }
}



module.exports = new V1RouteAsyncQuery();
