const { workerData, isMainThread, parentPort, Worker, threadId } = require("worker_threads");
const debug = require("debug")(`bte:biothings-explorer-trapi:worker${threadId}`);

if (!isMainThread) { // Log thread start before BioLink model loads
    debug(`Worker thread ${threadId} beginning task.`);
}

const { tasks } = require("../../routes/index");

const runTask = async (req, route) => {

    global.queryInformation = {
        queryGraph: req.body.message.query_graph,
    }

    if (!isMainThread) {
        await tasks[workerData.route](workerData.req);
        return undefined;
    } else {
        return await tasks[route](req);
    }
}

if (!isMainThread) {
    runTask(workerData.req, workerData.route);
}

exports.runTask = runTask;
