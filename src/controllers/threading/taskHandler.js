const { isMainThread, threadId } = require("worker_threads");
const debug = require("debug")(`bte:biothings-explorer-trapi:worker${threadId}`);

if (!isMainThread) {
  // Log thread start before BioLink model loads
  debug(`Worker thread ${threadId} is ready to accept tasks.`);
}

const { tasks } = require("../../routes/index");
const { getQueryQueue } = require("../async/asyncquery_queue");

const runTask = async ({ req, route, port, job: { jobId, queueName } = {} }) => {
  debug(`Worker thread ${threadId} beginning task.`);

  global.parentPort = port;
  port.postMessage({ threadId, registerId: true });
  global.cachingTasks = [];

  global.queryInformation = {
    queryGraph: req?.body?.message?.query_graph,
  };


  if (queueName) {
    const queue = await getQueryQueue(queueName);
    global.job = await queue.getJob(jobId);
  }

  const completedTask = await tasks[route](req);
  await Promise.all(global.cachingTasks);
  debug(`Worker thread ${threadId} completed task.`);
  return completedTask;
};

module.exports = runTask;
