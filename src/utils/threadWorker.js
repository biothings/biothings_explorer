const { Worker } = require("worker_threads");
const debug = require("debug")("bte:biothings-explorer-trapi:threading");
const path = require("path");

module.exports = function runWorker(task) {
    return new Promise((resolve, reject) => {
        const worker = new Worker(path.resolve(__dirname, "../server.js"), {
            workerData: { req: task.req, route: task.route },
        });
        let reqDone, cacheDone = false;
        worker.on("message", (...args) => {
            const workerID = worker.threadId;
            if (args[0].cacheDone) {
                cacheDone = true;
            } else {
                reqDone = true;
                resolve(...args);
            }
            if (reqDone && cacheDone) {
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
