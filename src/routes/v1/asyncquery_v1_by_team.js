const Queue = require('bull');
const path = require("path");
const axios = require('axios')
const { nanoid } = require('nanoid')
const redisClient = require('../../utils/cache/redis-client');
const config = require("./config");
const TRAPIGraphHandler = require("@biothings-explorer/query_graph_handler");
const swaggerValidation = require("../../middlewares/validate");
const smartAPIPath = path.resolve(__dirname, '../../../data/smartapi_specs.json');
const predicatesPath = path.resolve(__dirname, '../../../data/predicates.json');
const utils = require("../../utils/common");
const {asyncquery} = require('../../controllers/asyncquery');
const {getQueryQueue} = require('../../controllers/asyncquery_queue');

queryQueue = getQueryQueue('get query graph by team')

async function jobToBeDone(queryGraph, teamName, caching, enableIDResolution, workflow, webhook_url){
    utils.validateWorkflow(workflow);
    const handler = new TRAPIGraphHandler.TRAPIQueryHandler(
        {
            teamName,
            caching,
            enableIDResolution
        },
        smartAPIPath,
        predicatesPath,
        false
    );
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
            callback: null
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
        return jobToBeDone(
            job.data.queryGraph,
            job.data.teamName,
            job.data.caching,
            job.data.enableIDResolution,
            job.data.workflow,
            job.data.webhook_url);
    });
}

class V1RouteAsyncQueryByTeam {
    setRoutes(app) {
        app.post('/v1/team/:team_name/asyncquery', swaggerValidation.validate, async (req, res, next) => {
            queryQueue = getQueryQueue('get query graph by team')
            const queryGraph = req.body.message.query_graph;
            const enableIDResolution = (req.params.team_name === "Text Mining Provider") ? false : true;
            let queueData = {
                queryGraph: queryGraph,
                teamName: req.params.team_name,
                caching: req.query.caching,
                workflow: req.body.workflow,
                webhook_url: req.body.callback_url || req.body['callback'],
                enableIDResolution
            }
            await asyncquery(req, res, next, queueData, queryQueue)
        });
    }
}



module.exports = new V1RouteAsyncQueryByTeam();
