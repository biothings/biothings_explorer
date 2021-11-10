const { tasks } = require("../../routes/index");
const { workerData, isMainThread, parentPort, Worker, threadId } = require("worker_threads");
const debug = require("debug")(`bte:biothings-explorer-trapi:worker${threadId}`);

const runTask = async (req, route) => {
    if (!isMainThread) {
        await tasks[workerData.route](workerData.req);
        return undefined;
    } else {
        return await tasks[route](req);
    }
}

if (!isMainThread) {
    debug(`Worker thread ${threadId} beginning task.`);
    runTask(workerData.req, workerData.route);
}

exports.runTask = runTask;
