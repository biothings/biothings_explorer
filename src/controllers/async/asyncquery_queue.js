const Queue = require("bull");
const axios = require("axios");
const { redisClient } = require("@biothings-explorer/query_graph_handler");
const debug = require("debug")("bte:biothings-explorer-trapi:asyncquery_queue");
const Redis = require("ioredis");
const ps = require("ps-node");

// This shouldn't be necessary, as zombie bulls *should* self-destruct.
// essentially, this is the last-resort (and kills the job, so it perma-fails)
let zombieCleanupAttempts = 10;
const killZombies = () => {
  ps.lookup(
    {
      arguments: "bte-trapi-workspace/node_modules/bull/lib/process/master.js",
    },
    (err, results) => {
      let killed = 0;
      results.forEach(result => {
        if (result.ppid === "1") {
          process.kill(result.pid, "SIGKILL");
          killed += 1;
        }
      });
      if (killed > 0) debug(`Killed ${killed} zombie Bull processors`);
    },
  );
  zombieCleanupAttempts -= 1;
  if (zombieCleanupAttempts > 0) setTimeout(killZombies, 10000);
};
killZombies();

global.queryQueue = {};

exports.getQueryQueue = name => {
  let queryQueue = null;
  if (redisClient.clientEnabled && !process.env.INTERNAL_DISABLE_REDIS) {
    debug(
      `Getting queue ${name} using redis in ${process.env.REDIS_CLUSTER === "true" ? "cluster" : "non-cluster"} mode`,
    );
    let details = {
      createClient: () => {
        if (process.env.REDIS_CLUSTER === "true") {
          const details = {
            enableReadyCheck: false,
            maxRetriesPerRequest: null,
            redisOptions: {},
          };
          if (process.env.REDIS_PASSWORD) {
            details.redisOptions.password = process.env.REDIS_PASSWORD;
          }
          if (process.env.REDIS_TLS_ENABLED) {
            details.redisOptions.tls = { checkServerIdentity: () => undefined };
          }
          return new Redis.Cluster(
            [
              {
                host: process.env.REDIS_HOST,
                port: process.env.REDIS_PORT,
              },
            ],
            details,
          );
        } else {
          const details = {
            enableReadyCheck: false,
            maxRetriesPerRequest: null,
          };
          if (process.env.REDIS_PASSWORD) {
            details.password = process.env.REDIS_PASSWORD;
          }
          if (process.env.REDIS_TLS_ENABLED) {
            details.tls = { checkServerIdentity: () => undefined };
          }
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
    if (!global.queryQueue[name]) {
      global.queryQueue[name] = new Queue(name, process.env.REDIS_HOST ? details : "redis://127.0.0.1:6379", {
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
                  status: "JobQueuingError",
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
    queryQueue = global.queryQueue[name];
  }
  return queryQueue;
};
