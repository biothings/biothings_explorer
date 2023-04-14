const { isMainThread, threadId } = require("worker_threads");
const debug = require("debug")(`bte:biothings-explorer-trapi:worker${threadId}`);

if (!isMainThread) { // Log thread start before BioLink model loads
    debug(`Worker thread ${threadId} is ready to accept tasks.`);
}

const { tasks } = require("../../routes/index");

const runTask = async ({req, route, port}) => {
    debug(`Worker thread ${threadId} beginning task.`);
    global.parentPort = port;
    port.postMessage({ threadId, registerId: true });
    global.cachingTasks = [];

    global.queryInformation = {
        queryGraph: req?.body?.message?.query_graph,
    }


    const completedTask = await tasks[route](req);
    await Promise.all(global.cachingTasks);
    debug(`Worker thread ${threadId} completed task.`);
    return completedTask;

    // if (!isMainThread) {
    //     await tasks[workerData.route](workerData.req);
    //     return undefined;
    // } else {
    //     return await tasks[route](req);
    // }

}

// if (!isMainThread) {
//     runTask(workerData.req, workerData.route);
// }

// exports.runTask = runTask;
module.exports = runTask;
