const Queue = require('bull');
const path = require("path");
const axios = require('axios')
const config = require("./config");
const TRAPIGraphHandler = require("@biothings-explorer/query_graph_handler");
const swaggerValidation = require("../../middlewares/validate");
const smartAPIPath = path.resolve(__dirname, '../../../data/smartapi_specs.json');


// create job queue
const queryQueue = new Queue('get query graph');

queryQueue.on('global:completed', (jobId, result) => {
    console.log(`Job completed with result ${result}`);
});

async function jobToBeDone(queryGraph, caching, webhook_url){
    const handler = new TRAPIGraphHandler.TRAPIQueryHandler({ apiNames: config.API_LIST, caching: caching }, smartAPIPath);
    handler.setQueryGraph(queryGraph);
    await handler.query();
    const response = handler.getResponse();
    if(webhook_url){
        try{
            const res = await axios.post(webhook_url, JSON.stringify(response), {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }catch (e){
            console.error(e);
        }
    }
    return response;
}

queryQueue.process(async (job) => {
    return jobToBeDone(job.data.queryGraph, job.data.caching, job.data.webhook_url);
});

class V1RouteAsyncQuery {
    setRoutes(app) {
        app.post('/v1/async_query', swaggerValidation.validate, async (req, res, next) => {
            try {
                // add job to the queue
                let job = await queryQueue.add({queryGraph: req.body.message.query_graph,
                    caching: req.query.caching, webhook_url: req.query.webhook_url});
                res.setHeader('Content-Type', 'application/json');
                // return the job id so the user can check on it later
                res.end(JSON.stringify({id: job.id}));
            }
            catch (error) {
                next(error);
            }
        });
    }
}



module.exports = new V1RouteAsyncQuery();
