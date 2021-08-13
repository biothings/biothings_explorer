const Queue = require('bull');
const { createBullBoard } = require('@bull-board/api')
const { BullAdapter } = require('@bull-board/api/bullAdapter')
const { ExpressAdapter } = require('@bull-board/express')
const path = require("path");
const axios = require('axios')
const serverAdapter = require("../../bulladapter");
const redisClient = require('../../utils/cache/redis-client');
const app = require('../../app');
const config = require("./config");
const TRAPIGraphHandler = require("@biothings-explorer/query_graph_handler");
const swaggerValidation = require("../../middlewares/validate");
const smartAPIPath = path.resolve(__dirname, '../../../data/smartapi_specs.json');

// create job queue
let queryQueue = null;
if(redisClient){
    queryQueue = new Queue('get query graph', process.env.REDIS_HOST ?
        `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}` : 'redis://127.0.0.1:6379',
        {
            defaultJobOptions: {
                timeout: process.env.JOB_TIMEOUT
            }
        }).on('error', function (error){
        console.log('err', error)
    });
    const { addQueue, removeQueue, setQueues, replaceQueues } = createBullBoard({
        queues: [
            new BullAdapter(queryQueue),
        ],
        serverAdapter:serverAdapter
    })
}

if(queryQueue){
    queryQueue.on('global:completed', (jobId, result) => {
        console.log(`Job completed with result ${result}`);
    });
}

async function jobToBeDone(queryGraph, caching, webhook_url){
    const handler = new TRAPIGraphHandler.TRAPIQueryHandler({ apiNames: config.API_LIST, caching: caching }, smartAPIPath);
    handler.setQueryGraph(queryGraph);
    let response = null
    try{
        await handler.query();
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
        if(!webhook_url.startsWith('https://') && !webhook_url.startsWith('http://')){
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
            console.log(res)
        }catch (e){
            return {
                response: response,
                status: 200,
                callback: `Request failed, received code ${e.response.status}`
            }
        }
    }
    return {
        response: response,
        status: 200,
        callback: 'Data sent to callback_url'
    };
}

if(queryQueue){
    queryQueue.process(async (job) => {
        return jobToBeDone(job.data.queryGraph, job.data.caching, job.data.webhook_url);
    });
}

class V1RouteAsyncQuery {
    setRoutes(app) {
        app.post('/v1/asyncquery', swaggerValidation.validate, async (req, res, next) => {
            try {
                if(queryQueue){
                    // add job to the queue
                    let job = await queryQueue.add({queryGraph: req.body.message.query_graph,
                        webhook_url: req.body.callback_url,
                        caching: req.query.caching});
                    res.setHeader('Content-Type', 'application/json');
                    // return the job id so the user can check on it later
                    res.end(JSON.stringify({id: job.id}));
                }else{
                    res.status(503).end();
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
}



module.exports = new V1RouteAsyncQuery();
