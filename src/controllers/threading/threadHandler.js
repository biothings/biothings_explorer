const { MessageChannel, threadId } = require("worker_threads");
const debug = require("debug")("bte:biothings-explorer-trapi:threading");
const path = require("path");
// const taskHandler = require("./taskHandler");
const { redisClient } = require("@biothings-explorer/query_graph_handler");
const Piscina = require("piscina");
const { isWorkerThread } = require("piscina");
const EventEmitter = require("events");
const os = require("os");
const ServerOverloadedError = require("../../utils/errors/server_overloaded_error");
const { customAlphabet } = require("nanoid");
const { getQueryQueue } = require("../async/asyncquery_queue");

if (!global.threadpool && !isWorkerThread && !(process.env.USE_THREADING === "false")) {
  const env = {
    ...process.env,
    DEBUG_COLORS: true,
  };
  global.threadpool = {
    /**Medium-volume, medium-intensity requests
     * Maximum threads equal to 1/4 CPUs as BTE usually runs 4 intances
     * Maximum queue set, so if the queue if full, requests will be dropped
     * Usually, queuing will be handled by Bull, but if Bull is unavailable
     * (e.g. local debugging w/o a Redis instance), queuing falls back to Piscina
     */
    sync: new Piscina({
      filename: path.resolve(__dirname, "./taskHandler.js"),
      minThreads: 2,
      maxThreads: Math.ceil(os.cpus().length * 0.75), // on 8 cores, 24 given 4 instances
      maxQueue: 600,
      idleTimeout: 10 * 60 * 1000, // 10 minutes
      env,
    }),
    /**Low-volume, high-intensity requests
     * No other settings since this queue is handled externally with Bull
     * High timeout because we expect near-constant use, so rather not kill the thread
     */
    async: new Piscina({
      filename: path.resolve(__dirname, "./taskHandler.js"),
      maxThreads: 6, // 3 job queues allowing concurrency of 2
      minThreads: 1,
      idleTimeout: 60 * 60 * 1000, // 1 hour
      env,
    }),
    /**High-volume, low-intensity requests
     * Expecting frequent use, so timeout is high
     */
    misc: new Piscina({
      filename: path.resolve(__dirname, "./taskHandler.js"),
      idleTimeout: 60 * 60 * 1000, // 1 hour
      minThreads: 2,
      maxQueue: 600,
      env,
    }),
  };
}

const queueTaskToWorkers = async (pool, req, route, job) => {
  return new Promise(async (resolve, reject) => {
    let WorkerThreadID;
    const abortController = new AbortController();
    const { port1: toWorker, port2: fromWorker } = new MessageChannel();
    const task = pool.run({ req, route, port: toWorker }, { signal: abortController.signal, transferList: [toWorker] });
    if (job) {
      job.update({ ...job.data, abortController });
    }

    // catch failures that cause the worker to outright fail
    task.catch(error => {
      if (error.name === "AbortError") {
        debug(`Worker thread ${WorkerThreadID} terminated successfully.`);
      } else if (error.message === "Task queue is at limit") {
        debug(
          [pool === global.threadpool.sync ? "Synchronous" : "Misc", "server queue is at limit, job rejected."].join(
            " ",
          ),
        );
        const expectedWaitTime = Math.ceil(pool.waitTime.p99 / 1000) + 1;
        const message = [
          "The server is currently under heavy load.",
          ` Please try again after about ${expectedWaitTime}s`,
          pool === global.threadpool.sync ? ", or try using the asynchronous endpoints." : ".",
        ].join("");
        error = new ServerOverloadedError(message, expectedWaitTime);
      } else {
        debug(`Caught error in worker thread ${WorkerThreadID}, error below:`);
        debug(error);
      }
      reject(error);
    });
    let reqDone = false;
    let cacheInProgress = 0;
    let cacheKeys = {};
    const timeout = parseInt(process.env.REQUEST_TIMEOUT) * 1000;
    fromWorker.on("message", ({ threadId, ...msg }) => {
      if (msg.cacheInProgress) {
        // cache handler has started caching
        cacheInProgress += 1;
      } else if (msg.addCacheKey) {
        // hashed edge id cache in progress
        cacheKeys[msg.cacheKey] = false;
      } else if (msg.completeCacheKey) {
        // hashed edge id cache complete
        cacheKeys[msg.cacheKey] = true;
      } else if (msg.registerId) {
        if (job) {
          WorkerThreadID = threadId;
          job.update({ ...job.data, threadId });
        }
      } else if (typeof msg.cacheDone !== "undefined") {
        cacheInProgress = msg.cacheDone
          ? cacheInProgress - 1 // a caching handler has finished caching
          : 0; // caching has been entirely cancelled
      } else if (typeof msg.result !== "undefined") {
        // request has finished with a message
        reqDone = true;
        resolve(msg);
      } else if (msg.err) {
        // request has resulted in a catchable error
        reqDone = true;
        reject(msg.err);
      }
      if (reqDone && cacheInProgress <= 0 && job) {
        job.progress(100);
      }
    });

    if (timeout && pool !== global.threadpool.async) {
      setTimeout(() => {
        // clean up any incompletely cached hashes to avoid issues pulling from cache
        const activeKeys = Object.entries(cacheKeys).filter(([key, complete]) => !complete);
        if (activeKeys.length) {
          try {
            redisClient.client.delTimeout(activeKeys);
          } catch (error) {
            null;
          }
        }
        abortController.abort();
        reject(
          new Error(
            `Request timed out (exceeded time limit of ${
              timeout / 1000
            }s). Please use the asynchronous endpoint (/v1/asyncquery) for long-running queries.`,
          ),
        );
      }, timeout);
    }
  });
};

async function runTask(req, task, route, res, useBullSync = true) {
  const queryQueue = global.queryQueue.bte_sync_query_queue;
  req = {
    data: {
      route,
      queryGraph: req.body.message?.query_graph,
      workflow: req.body.workflow,
      options: {
        logLevel: req.body.log_level,
        submitter: req.body.submitter,
        smartAPIID: req.params.smartapi_id,
        teamName: req.params.team_name,
        ...req.query,
      },
    },
    params: req.params,
  };
  if (queryQueue && useBullSync) {
    const nanoid = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", 10);
    const jobId = nanoid();
    const jobOpts = { jobId, attempts: 1, timeout: undefined };

    if ((await queryQueue.count()) >= 600) {
      const pool = global.threadpool.sync;
      const expectedWaitTime = Math.ceil(pool.waitTime.p99 / 1000) + 1;
      const message = [
        "The server is currently under heavy load.",
        ` Please try again after about ${expectedWaitTime}s`,
        ", or try using the asynchronous endpoints.",
      ].join("");
      throw new ServerOverloadedError(message, expectedWaitTime);
    }

    try {
      const job = await queryQueue.add(req.data, jobOpts);
      const response = await job.finished();
      return response;
    } catch (error) {
      throw error;
    }
  }
  // redis unavailable or query not to sync queue such as check_query_status
  if (!(process.env.USE_THREADING === "false")) {
    const response = await queueTaskToWorkers(
      useBullSync ? global.threadpool.sync : global.threadpool.misc,
      req,
      route,
    );
    if (typeof response.result !== "undefined") {
      if (response.status) {
        res?.status(response.status);
      }
      return response.result ? response.result : undefined; // null msg means keep response body empty
    } else if (response.err) {
      throw new response.err();
    } else {
      throw new Error("Threading Error: Task resolved without message");
    }
  }
  // threading disabled
  try {
    const response = await task(req);
    return response;
  } catch (error) {
    throw error;
  }
}

async function runBullTask(job, route, async = true) {
  const req = { id: job.id, data: { ...job.data } };
  return new Promise(async (resolve, reject) => {
    try {
      const response = await queueTaskToWorkers(
        async ? global.threadpool.async : global.threadpool.sync,
        req,
        route,
        job,
      );
      if (typeof response.result !== "undefined") {
        resolve(response.result ? response.result : undefined); // null result means keep response body empty
      } else if (response.err) {
        reject(response.err);
      } else {
        reject(new Error("Threading Error: Task resolved without message"));
      }
    } catch (error) {
      reject(error);
    }
  });
}

function taskResponse(response, status = undefined) {
  if (global.parentPort) {
    global.parentPort.postMessage({ threadId, result: response, status: status });
    return undefined;
  } else {
    return response;
  }
}

function taskError(error) {
  if (global.parentPort) {
    global.parentPort.postMessage({ threadId, err: error });
    return undefined;
  } else {
    throw error;
  }
}

if (!global.queryQueue.bte_sync_query_queue && !isWorkerThread) {
  getQueryQueue("bte_sync_query_queue");
  if (global.queryQueue.bte_sync_query_queue) {
    global.queryQueue.bte_sync_query_queue.process(Math.ceil(os.cpus().length * 0.75), async job => {
      return await runBullTask(job, job.data.route, false);
    });
  }
}

module.exports = {
  runTask,
  runBullTask,
  taskResponse,
  taskError,
};
