const { isMainThread, threadId } = require("worker_threads");
const debug = require("debug")(`bte:biothings-explorer-trapi:worker${threadId}`);

if (!isMainThread) {
  // Log thread start before BioLink model loads
  debug(`Worker thread ${threadId} is ready to accept tasks.`);
}

const { tasks } = require("../../routes/index");
const { getQueryQueue } = require("../async/asyncquery_queue");
const Sentry = require('@sentry/node');
const { ProfilingIntegration  } = require('@sentry/profiling-node');

Sentry.init({
    dsn: "https://5297933ef0f6487c9fd66532bb1fcefe@o4505444772806656.ingest.sentry.io/4505449737420800",
    integrations: [
      // Automatically instrument Node.js libraries and frameworks
      ...Sentry.autoDiscoverNodePerformanceMonitoringIntegrations(),
      new ProfilingIntegration()
    ],
  
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
    profilesSampleRate: 1.0 // Profiling sample rate is relative to tracesSampleRate
});

const runTask = async ({ req, route, port, job: { jobId, queueName } = {} }) => {
    debug("here " + (new Error()).stack);
  debug(`Worker thread ${threadId} beginning task.`);

  global.parentPort = port;
  port.postMessage({ threadId, registerId: true });
  global.cachingTasks = [];

  global.queryInformation = {
    queryGraph: req?.body?.message?.query_graph,
  };

  debug("there")

  if (queueName) {
    const queue = await getQueryQueue(queueName);
    debug("between everywhere")
    global.job = await queue.getJob(jobId);
  }

  debug("everywhere")

  const transaction = Sentry.startTransaction({ name: route });
  debug(`transaction started ${transaction.spanId}` + (new Error()).stack)
  transaction.setData("request", req.data.queryGraph);
  Sentry.getCurrentHub().configureScope((scope) => scope.setSpan(transaction));

  const completedTask = await tasks[route](req);
  await Promise.all(global.cachingTasks);

  debug(`transaction finished for ${transaction.spanId} with data ${JSON.stringify(transaction.data)} for ${transaction.name}`);
  transaction.finish();

  debug(`Worker thread ${threadId} completed task.`);
  return completedTask;
};

module.exports = runTask;
