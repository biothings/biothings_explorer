const app = require("./app");
const cron = require("./controllers/cron/index");
const { threadHandlers } = require("./routes/index");
const { workerData, isMainThread, parentPort, Worker, threadId } = require("worker_threads");
const debug = require("debug")(`bte:biothings-explorer-trapi:worker${threadId}`);


async function main() {
  if (isMainThread) {
    const PORT = Number.parseInt(process.env.PORT) || 3000;
    cron();
    app.listen(PORT, () => console.log(`App listening at http://localhost:${PORT}`));
  } else {
    debug(`Worker thread ${threadId} beginning task.`);
    await threadHandlers[workerData.route](workerData.req, parentPort);
  }
}

main();
