const { Worker } = require("worker_threads");
const debug = require("debug")("bte:biothings-explorer-trapi:threading");
const path = require("path");

module.exports = function runWorker(task) {
    return new Promise((resolve, reject) => {
        const worker = new Worker(path.resolve(__dirname, "../server.js"), {
            workerData: { req: task.req, route: task.route },
        });
        let reqDone = false;
        let cacheSteps;
        try {
            cacheSteps = Object.keys(task.req.body.message.query_graph.edges).length;
        } catch (e) {
            cacheSteps = 0;
        }
        worker.on("message", (...args) => {
            const workerID = worker.threadId;
            if (args[0].cacheDone) {
                if (typeof args[0].cacheDone === 'number') {
                    cacheSteps -= args[0].cacheDone;
                } else {
                    cacheSteps = 0;
                }
            } else {
                reqDone = true;
                resolve(...args);
            }
            if (reqDone && cacheSteps === 0) {
                worker.terminate().then(() => debug(`Worker thread ${workerID} completed task, terminated successfully.`));
            }
        });
        worker.on("error", reject);
        worker.on("exit", code => {
            if (code !== 0) {
                reject(new Error(`Worker ${worker.threadId} exited with code ${code}`));
            }
        });
        const timeout = parseInt(process.env.REQUEST_TIMEOUT) * 1000;
        if (timeout) {
            setTimeout(() => {
                worker.terminate();
                reject(new Error(`Request timed out (exceeded time limit of ${timeout}s)`));
            }, timeout);
        }
    });
};
