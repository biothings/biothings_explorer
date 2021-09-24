const { Worker } = require("worker_threads");
const path = require("path");

module.exports = function runWorker(task) {
    return new Promise((resolve, reject) => {
        const worker = new Worker(path.resolve(__dirname, "../server.js"), {
            workerData: { req: task.req, route: task.route },
        });
        worker.on("message", resolve);
        worker.on("error", reject);
        worker.on("exit", code => {
            if (code !== 0) {
                reject(new Error(`Worker exited with code ${code}`));
            }
        });
        const timeout = parseInt(process.env.REQUEST_TIMEOUT || 300000);
        setTimeout(() => {
            worker.terminate();
            reject(new Error(`Request timed out (exceeded time limit of ${timeout}ms)`));
        }, timeout);
    });
};
