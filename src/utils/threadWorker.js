const { Worker } = require("worker_threads");
const debug = require("debug")("bte:biothings-explorer-trapi:threading");
const path = require("path");

module.exports = function runWorker(task) {
    return new Promise((resolve, reject) => {
        const worker = new Worker(path.resolve(__dirname, "../server.js"), {
            workerData: { req: task.req, route: task.route },
        });
        let reqDone = false;
        let cacheInProgress = 0;
        worker.on("message", (...args) => {
            const workerID = worker.threadId;
            if (args[0].cacheInProgress) {
                cacheInProgress += 1;
            }
            if (args[0].cacheDone) {
                if (typeof args[0].cacheDone === 'number') {
                    cacheInProgress -= args[0].cacheDone;
                } else {
                    cacheInProgress = 0;
                }
            } else if (args[0].msg) {
                reqDone = true;
                resolve(...args);
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
        const timeout = parseInt(process.env.REQUEST_TIMEOUT) * 1000;
        if (timeout) {
            setTimeout(() => {
                worker.terminate();
                reject(new Error(`Request timed out (exceeded time limit of ${timeout}s)`));
            }, timeout);
        }
    });
};
