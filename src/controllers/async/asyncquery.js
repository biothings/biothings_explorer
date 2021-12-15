const axios = require('axios');
const { customAlphabet } = require('nanoid');
const utils = require('../../utils/common');
const redisClient = require('@biothings-explorer/query_graph_handler').redisClient;
const async = require('async');

exports.asyncquery = async (req, res, next, queueData, queryQueue) => {
    try {
        if(queryQueue){
            const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 10)

            const jobId = nanoid();

            // add job to the queue
            let url
            if(queryQueue.name==='get query graph'){
                url = `${req.protocol}://${req.header('host')}/v1/check_query_status/${jobId}`
            }
            if(queryQueue.name==='get query graph by api'){
                url = `${req.protocol}://${req.header('host')}/v1/check_query_status/${jobId}?by=api`
            }
            if(queryQueue.name==='get query graph by team'){
                url = `${req.protocol}://${req.header('host')}/v1/check_query_status/${jobId}?by=team`
            }
            let job = await queryQueue.add(
                queueData,
                {
                    jobId: jobId,
                    url: url
                });
            res.setHeader('Content-Type', 'application/json');
            // return the job id so the user can check on it later
            res.end(JSON.stringify({id: job.id, url: url}));
        }else{
            res.setHeader('Content-Type', 'application/json');
            res.status(503).end(JSON.stringify({'error': 'Redis service is unavailable'}));
        }
    }
    catch (error) {
        next(error);
    }
}

async function storeQueryResponse(jobID, response) {
  const unlock = await redisClient.lock(`asyncQueryResult${jobID}Lock`);
  try {
    // workflow
    await Promise.all(
      response.workflow?.map(async (obj, i) => {
        await redisClient.hsetAsync(`asyncQueryResult_${jobID}_workflow`, String(i), JSON.stringify(obj));
      }),
    );
    // query graph
    await redisClient.setAsync(`asyncQueryResult_${jobID}_querygraph`, JSON.stringify(response.message?.query_graph));
    // kg nodes
    if (response.message?.knowledge_graph?.nodes) {
      await Promise.all(
        Object.entries(response.message.knowledge_graph.nodes).map(async ([nodeID, node]) => {
          await redisClient.hsetAsync(`asyncQueryResult_${jobID}_nodes`, nodeID, JSON.stringify(node));
        }),
      );
    }
    // edges
    if (response.message?.knowledge_graph?.edges) {
      await Promise.all(
        Object.entries(response.message.knowledge_graph.edges).map(async ([edgeID, edge]) => {
          await redisClient.hsetAsync(`asyncQueryResult_${jobID}_edges`, edgeID, JSON.stringify(edge));
        }),
      );
    }
    // results
    await Promise.all(
      response.message?.results?.map(async (result, i) => {
        await redisClient.hsetAsync(`asyncQueryResult_${jobID}_results`, String(i), JSON.stringify(result));
      }),
    );
    // logs
    await Promise.all(
      response.logs?.map(async (log, i) => {
        await redisClient.hsetAsync(`asyncQueryResult_${jobID}_logs`, String(i), JSON.stringify(log));
      }),
    );
  } finally {
    unlock();
  }
}

exports.getQueryResponse = async (jobID) => {
  const unlock = await redisClient.lock(`asyncQueryResult${jobID}Lock`);
  let response;
  try {
    response = {
      workflow: Object.entries(await redisClient.hgetallAsync(`asyncQueryResult_${jobID}_workflow`))
        .sort(([key1], [key2]) => parseInt(key1) - parseInt(key2))
        .map(([key, val]) => JSON.parse(val)),
      message: {
        query_graph: JSON.parse(await redisClient.getAsync(`asyncQueryResult_${jobID}_querygraph`)),
        knowledge_graph: {
          nodes: await redisClient.hgetallAsync(`asyncQueryResult_${jobID}_nodes`),
          edges: await redisClient.hgetallAsync(`asyncQueryResult_${jobID}_edges`),
        },
        results: Object.entries(await redisClient.hgetallAsync(`asyncQueryResult_${jobID}_results`))
          .sort(([key1], [key2]) => parseInt(key1) - parseInt(key2))
          .map(([key, val]) => JSON.parse(val)),
      },
      logs: Object.entries(await redisClient.hgetallAsync(`asyncQueryResult_${jobID}_logs`))
        .sort(([key1], [key2]) => parseInt(key1) - parseInt(key2))
        .map(([key, val]) => JSON.parse(val)),
    };
  } finally {
    unlock();
  }
  return response ? response : undefined;
  // TODO implement
}

exports.asyncqueryResponse = async (handler, callback_url, jobID = null) => {
    let response;
    let callback_response;
    try {
        await handler.query();
        response = handler.getResponse();
        if (jobID) {
            await storeQueryResponse(jobID, response);
        }
        response = true;
    } catch (e) {
        console.error(e)
        //shape error > will be handled below
        response = {
            error: e?.name,
            message: e?.message
        };
    }
    if (callback_url) {
        if (!utils.stringIsAValidUrl(callback_url)) {
            return {
                response: response,
                status: 200,
                callback: 'The callback url must be a valid url'
            }
        }
        try {
            callback_response = await axios.post(callback_url, JSON.stringify(response), {
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 300000,   // 5min
                maxBodyLength: 2 * 1000 * 1000 * 1000 // 2GB
            });
            //console.log(res)
        } catch (e) {
            return {
                response: response,
                status: e.response?.status,
                callback: `Request failed, received code ${e.response?.status}`
            }
        }
    } else {
        return {
            response: response,
            status: 200,
            callback: 'Callback url was not provided'
        };
    }
    return {
        response: response,
        status: callback_response?.status,
        callback: 'Data sent to callback_url'
    };
}
