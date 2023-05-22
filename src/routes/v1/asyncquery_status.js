const path = require("path");
const { redisClient } = require("@biothings-explorer/query_graph_handler");
const { getQueryQueue } = require("../../controllers/async/asyncquery_queue");
const { getQueryResponse } = require("../../controllers/async/asyncquery");
const lz4 = require("lz4");
const utils = require("../../utils/common");

let queryQueue;

const swaggerValidation = require("../../middlewares/validate");
const { runTask, taskResponse, taskError } = require("../../controllers/threading/threadHandler");
const debug = require("debug")("bte:biothings-explorer-trapi:async");

class VCheckQueryStatus {
  setRoutes(app) {
    app
      .route(["/v1/asyncquery_status/:id", "/v1/asyncquery_response/:id"])
      .get(swaggerValidation.validate, async (req, res, next) => {
        try {
          const response = await runTask(req, this.task, path.parse(__filename).name, res, false);
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(response));
        } catch (err) {
          next(err);
        }
      })
      .all(utils.methodNotAllowed);
  }

  async task(req) {
    //logger.info("query /query endpoint")
    try {
      debug(`checking query status of job ${req.params.id}`);
      let by = req.data.options.by;
      let job_id = req.params.id;
      let queryQueue;
      if (redisClient.clientEnabled) {
        if (job_id.startsWith("BT_")) {
          queryQueue = getQueryQueue("bte_query_queue_by_team");
        } else if (job_id.startsWith("BA_")) {
          queryQueue = getQueryQueue("bte_query_queue_by_api");
        } else {
          queryQueue = getQueryQueue("bte_query_queue");
        }
      }
      if (queryQueue) {
        let job = await queryQueue.getJobFromId(job_id);

        if (job === null) {
          return taskResponse(null, 404);
        }
        await queryQueue.isReady();
        const state = await job.getState();
        let logs = await queryQueue.getJobLogs(job_id);
        logs = logs.logs.map(log => JSON.parse(log));
        let [status, description] = {
          // convert to TRAPI states
          completed: ["Completed", "The query has finixhed executing."],
          failed: ["Failed", job.failedReason],
          delayed: ["Queued", "The query is queued, but has been delayed."],
          active: ["Running", "The query is currently being processed."],
          waiting: ["Queued", "The query is waiting in the queue."],
          paused: ["Queued", "The query is queued, but the queue is temporarily paused."],
          stuck: ["Failed", "The query is stuck (if you see this, raise an issue)."],
          null: ["Failed", "The query status is unknown, presumed failed (if you see this, raise an issue)."],
        }[state];
        let progress = job._progress;
        if (status === "Failed") {
          if (description.includes("Promise timed out")) {
            // something might break when calculating process.env.JOB_TIMEOUT so wrap it in try catch
            try {
              return taskResponse({
                job_id,
                status,
                description: `Job was stopped after exceeding time limit of ${
                  parseInt(process.env.JOB_TIMEOUT) / 1000
                }s`,
                logs,
              });
            } catch (e) {
              return taskResponse({ job_id, status, description, logs });
            }
          }
          return taskResponse({ job_id, status, description, logs });
        }

        // If done, just give response if using the response_url
        if (state === "completed" && req.endpoint.includes("asyncquery_response")) {
          let returnValue;
          const storedResponse = await getQueryResponse(job_id, req.data.options.logLevel);
          returnValue = storedResponse ? storedResponse : { error: "Response expired. Responses are kept 30 days." };
          return taskResponse(returnValue, returnValue.status || 200);
        }

        taskResponse({ job_id, status, progress, description, response_url: job.data.url, logs }, 200);
      } else {
        taskResponse({ error: "Redis service is unavailable" }, 503);
      }
    } catch (error) {
      taskError(error);
    }
  }
}

module.exports = new VCheckQueryStatus();
