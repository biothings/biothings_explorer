const { Worker, parentPort } = require("worker_threads");
const debug = require("debug")("bte:biothings-explorer-trapi:threading");
const path = require("path");
// const taskHandler = require("./taskHandler");
const { redisClient } = require("@biothings-explorer/query_graph_handler");

const createNewWorker = async (req, route) => {
    return new Promise((resolve, reject) => {
        const worker = new Worker(path.resolve(__dirname, "./taskHandler.js"), {
            workerData: { req: req, route: route },
        });
        let reqDone = false;
        let cacheInProgress = 0;
        let cacheKeys = {};
        const timeout = parseInt(process.env.REQUEST_TIMEOUT) * 1000;
        worker.on("message", (...args) => {
            const workerID = worker.threadId;
            if (args[0].cacheInProgress) { // cache handler has started caching
                cacheInProgress += 1;
            } else if (args[0].addCacheKey) { // hashed edge id cache in progress
                cacheKeys[args[0].cacheKey] = false;
            } else if (args[0].completeCacheKey) { // hashed edge id cache complete
                cacheKeys[args[0].cacheKey] = true;
            } else if (typeof args[0].cacheDone !== 'undefined') {
                cacheInProgress = args[0].cacheDone
                    ? cacheInProgress - 1 // a caching handler has finished caching
                    : 0 // caching has been entirely cancelled
            } else if (typeof args[0].msg !== 'undefined') { // request has finished with a message
                reqDone = true;
                resolve(...args);
            } else if (args[0].err) {
                reqDone = true;
                reject(args[0].err);
            }
            if (reqDone && cacheInProgress <= 0) {
                worker.terminate().then(() => debug(`Worker thread ${workerID} completed task, terminated successfully.`));
            }
        });
        worker.on("error", (...args) => {
            reqDone = true; // allows caching to finish if any was started.
            reject(...args);
        });
        worker.on("exit", code => {
            if (code !== 0) {
                reject(new Error(`Worker ${worker.threadId} exited with code ${code}`));
            }
        });
        if (timeout) {
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
                worker.terminate();
                reject(new Error(`Request timed out (exceeded time limit of ${timeout / 1000}s). Please use the asynchronous endpoint (/v1/asyncquery) for long-running queries.`));
            }, timeout);
        }
    });
}

module.exports = {
    runTask: async (req, task, route, res = undefined) => {
        return new Promise(async (resolve, reject) => {
            try {
                req = {  // obj communicable between threads
                  body: req.body,
                  headers: req.headers,
                  host: req.hostname,
                  method: req.method,
                  params: req.params,
                  path: req.path,
                  query: req.query,
                  rateLimit: req.rateLimit,
                  schema: req.schema
                };
                if (!(process.env.USE_THREADING === 'false')) {
                    const response = await createNewWorker(req, route);
                    if (typeof response.msg !== 'undefined') {
                        if (response.status) {
                            res?.status(response.status);
                        }
                        resolve(response.msg ? response.msg : undefined); // null msg means keep response body empty
                    } else if (response.err) {
                        reject(response.err);
                    } else {
                        reject(new Error('Threading Error: Task resolved without message'));
                    }
                } else {
                    const response = await task(req);
                    resolve(response)
                }
            } catch (error) {
                reject(error);
            }
        });
    },
    taskResponse: (response, status = undefined) => {
        if (parentPort) {
            parentPort.postMessage({ msg: response, status: status});
            return undefined;
        } else {
            return response;
        }
    },
    taskError: (error) => {
        if (parentPort) {
            parentPort.postMessage({ err: error });
            return undefined;
        } else {
            throw error;
        }
    }
}
