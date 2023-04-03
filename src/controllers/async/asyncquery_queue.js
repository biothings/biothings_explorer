const Queue = require("bull");
const axios = require("axios");
const { redisClient, getNewRedisClient } = require("@biothings-explorer/query_graph_handler");
const debug = require("debug")("bte:biothings-explorer-trapi:asyncquery_queue");
const Redis = require("ioredis");
const ps = require("ps-node");

global.queryQueue = {};

exports.getQueryQueue = name => {
  let queryQueue = null;
  if (!redisClient.clientEnabled || process.env.INTERNAL_DISABLE_REDIS) {
    return queryQueue;
  }
  debug(
    `Getting queue ${name} using redis in ${process.env.REDIS_CLUSTER === "true" ? "cluster" : "non-cluster"} mode`,
  );
  if (global.queryQueue[name]) {
    return global.queryQueue[name];
  }
  debug(`Initializing queue ${name} for first time...`);
  let details = {
    createClient: () => {
      const client = getNewRedisClient();
      client.internalClient.options.enableReadyCheck = false;
      client.internalClient.options.maxRetriesPerRequest = null;
      return client.internalClient;
    },
    // createClient: () => redis.createCluster({
    // }),
    prefix: `{BTE:bull}`,
  };
  global.queryQueue[name] = new Queue(name, process.env.REDIS_HOST ? details : "redis://127.0.0.1:6379", {
    defaultJobOptions: {
      removeOnFail: {
        age: 24 * 60 * 60, // keep failed jobs for a day (in case user needs to review fail reason)
        count: 3000 // enough to keep about 33/day for 90 days worth
      },
      removeOnComplete: {
        age: 90 * 24 * 60 * 60, // keep completed jobs for 90 days
        count: 3000 // enough to keep about 33/day for 90 days worth
      },
    },
    settings: {
      maxStalledCount: 1,
      //lockDuration: 300000
      lockDuration: 3600000, // 60min
    },
  })
    .on("error", function (error) {
      console.log("err", error);
    })
    .on("failed", async function (job, error) {
      debug(`Async job ${job.id} failed with error ${error.message}`);
      try {
        job.data.abortController.abort();
      } catch (error) {
        debug(error);
      }
      if (job.data.callback_url) {
        try {
          await axios({
            method: "post",
            url: job.data.callback_url,
            data: {
              message: {
                query_graph: job.data.queryGraph,
                knowledge_graph: { nodes: {}, edges: {} },
                results: [],
              },
              status: "JobQueuingError",
              description: error.toString(),
              trace: process.env.NODE_ENV === "production" ? undefined : error.stack,
            },
          });
        } catch (error) {
          debug(`Callback failed with error ${error.message}`);
        }
      }
    });

  return global.queryQueue[name];
};
