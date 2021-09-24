const app = require("./app");
const cron = require("./controllers/cron/index");
const { threadHandlers } = require("./routes/index");
const { workerData, isMainThread, parentPort, Worker } = require("worker_threads");

const PORT = Number.parseInt(process.env.PORT) || 3000;

cron();

if (isMainThread) {
  app.listen(PORT, () => console.log(`App listening at http://localhost:3000`))
} else {
  threadHandlers[workerData.route](workerData.req, parentPort);
}
