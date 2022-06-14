const Queue = require("bull");
const axios = require("axios");
const { redisClient } = require("@biothings-explorer/query_graph_handler");
const Redis = require("ioredis");

exports.getQueryQueue = name => {
  let queryQueue = null;
  if (redisClient.clientEnabled && !process.env.INTERNAL_DISABLE_REDIS) {
    let details = {
      createClient: () => {
        if (process.env.REDIS_CLUSTER === "true") {
          return new Redis.Cluster(
            [
              {
                host: process.env.REDIS_HOST,
                port: process.env.REDIS_PORT,
              },
            ],
            {
              enableReadyCheck: false,
              maxRetriesPerRequest: null,
            },
          );
        } else {
          return new Redis({
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT,
            enableReadyCheck: false,
            maxRetriesPerRequest: null,
          });
        }
      },
      // createClient: () => redis.createCluster({
      // }),
      prefix: `{BTE:bull:${name}}`,
    };
    if (process.env.REDIS_PASSWORD) {
      details.password = process.env.REDIS_PASSWORD;
    }
    if (process.env.REDIS_TLS_ENABLED) {
      details.tls = { checkServerIdentity: () => undefined };
    }
    queryQueue = new Queue(name, process.env.REDIS_HOST ? details : "redis://127.0.0.1:6379", {
      defaultJobOptions: {
        timeout: process.env.JOB_TIMEOUT,
        removeOnFail: true,
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
        console.log(`Async job ${job.id} failed with error ${error.message}`);
        console.trace(error);
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
                status: 500,
                description: error.toString(),
                trace: process.env.NODE_ENV === "production" ? undefined : error.stack,
              },
            });
          } catch (error) {
            console.log(`Callback failed with error ${error.message}`);
          }
        }
      });
  }
  return queryQueue;
};
