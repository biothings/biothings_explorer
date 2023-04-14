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
      .route("/v1/check_query_status/:id")
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
      let id = req.params.id;
      let queryQueue;
      if (redisClient.clientEnabled) {
        if (id.startsWith("BT_")) {
          queryQueue = getQueryQueue("bte_query_queue_by_team");
        } else if (id.startsWith("BA_")) {
          queryQueue = getQueryQueue("bte_query_queue_by_api");
        } else {
          queryQueue = getQueryQueue("bte_query_queue");
        }
      }
      if (queryQueue) {
        let job = await queryQueue.getJobFromId(id);

        if (job === null) {
          taskResponse(null, 404);
        } else {
          await queryQueue.isReady();
          let state = await job.getState();
          let progress = job._progress;
          let reason = job.failedReason;
          if (reason) {
            if (reason.includes("Promise timed out")) {
              // something might break when calculating process.env.JOB_TIMEOUT so wrap it in try catch
              try {
                // This will always be using the variable from process.env instead of the value that actually timed out during runtime
                // To display the true timed out value extract it from "reason"
                taskResponse({
                  id,
                  state,
                  reason: `Job was stopped after exceeding time limit of ${parseInt(process.env.JOB_TIMEOUT) / 1000}s`,
                });
              } catch (e) {
                taskResponse({ id, state, reason });
              }
            }
            taskResponse({ id, state, reason });
          }
          let returnvalue = job.returnvalue;
          if (returnvalue?.response && !returnvalue?.response?.error) {
            const storedResponse = await getQueryResponse(id, req.data.options.logLevel);
            if (storedResponse) {
              returnvalue.response = storedResponse;
            } else {
              state = "completed (results expired)";
              returnvalue.response = "expired";
            }
          }
          // let response = returnvalue?.response;
          taskResponse({ id, state, returnvalue, progress, reason }, returnvalue?.status || 200);
        }
      } else {
        taskResponse({ error: "Redis service is unavailable" }, 503);
      }
    } catch (error) {
      taskError(error);
    }
  }
}

module.exports = new VCheckQueryStatus();
