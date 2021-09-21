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
const {asyncquery, asyncqueryResponse} = require('../../controllers/asyncquery');
const {getQueryQueue} = require('../../controllers/asyncquery_queue');

queryQueue = getQueryQueue('get query graph by team')

async function jobToBeDone(queryGraph, teamName, caching, enableIDResolution, workflow, callback_url){
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
    return await asyncqueryResponse(handler, callback_url);
}

if(queryQueue){
    queryQueue.process(async (job) => {
        return await jobToBeDone(
            job.data.queryGraph,
            job.data.teamName,
            job.data.caching,
            job.data.enableIDResolution,
            job.data.workflow,
            job.data.callback_url);
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
                callback_url: req.body.callback_url || req.body['callback'],
                enableIDResolution
            }
            await asyncquery(req, res, next, queueData, queryQueue)
        });
    }
}



module.exports = new V1RouteAsyncQueryByTeam();
