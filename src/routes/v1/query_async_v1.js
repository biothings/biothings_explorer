const Queue = require('bull');
const path = require("path");
const axios = require('axios')
const redisClient = require('../../utils/cache/redis-client');
const config = require("./config");
const TRAPIGraphHandler = require("@biothings-explorer/query_graph_handler");
const swaggerValidation = require("../../middlewares/validate");
const smartAPIPath = path.resolve(__dirname, '../../../data/smartapi_specs.json');
const { v4: uuidv4 } = require('uuid');
const URL = require("url").URL;

const stringIsAValidUrl = (s) => {
    try {
        new URL(s);
        return true;
    } catch (err) {
        return false;
    }
};

// create job queue
let queryQueue = null;
if(Object.keys(redisClient).length !== 0){
    queryQueue = new Queue('get query graph', process.env.REDIS_HOST ?
        `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}` : 'redis://127.0.0.1:6379',
        {
            defaultJobOptions: {
                timeout: process.env.JOB_TIMEOUT,
            },
            settings: {
                maxStalledCount: 0,
                lockDuration: 300000
            }
        }).on('error', function (error){
        console.log('err', error)
    });
}

if(queryQueue){
    queryQueue.on('global:completed', (jobId, result) => {
        //console.log(`Job completed with result ${result}`);
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
        if(!stringIsAValidUrl(webhook_url)){
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
                    let job = await queryQueue.add(
                        {
                            queryGraph: req.body.message.query_graph,
                            webhook_url: req.body.callback_url,
                            caching: req.query.caching
                        },
                        {
                            jobId: uuidv4()
                        });
                    res.setHeader('Content-Type', 'application/json');
                    // return the job id so the user can check on it later
                    res.end(JSON.stringify({id: job.id}));
                }else{
                    res.setHeader('Content-Type', 'application/json');
                    res.status(503).end(JSON.stringify({'error': 'Redis service is unavailable'}));
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
}



module.exports = new V1RouteAsyncQuery();
