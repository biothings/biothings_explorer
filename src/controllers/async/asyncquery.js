const axios = require("axios");
const { customAlphabet } = require("nanoid");
const utils = require("../../utils/common");
const { redisClient } = require("@biothings-explorer/query_graph_handler");
const { LogEntry } = require("@biothings-explorer/query_graph_handler");
const lz4 = require("lz4");
const { Readable } = require("stream");
const chunker = require("stream-chunker");
const { parser } = require("stream-json");
const Assembler = require("stream-json/Assembler");

exports.asyncquery = async (req, res, next, queueData, queryQueue) => {
  try {
    if (queryQueue) {
      const nanoid = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", 10);

      let jobId = nanoid();

      // add job to the queue
      let url;
      if (queryQueue.name === "bte_query_queue_by_api") {
        jobId = `BA_${jobId}`;
      }
      if (queryQueue.name === "bte_query_queue_by_team") {
        jobId = `BT_${jobId}`;
      }
      url = `${req.protocol}://${req.header("host")}/v1/check_query_status/${jobId}`;

      let job = await queryQueue.add(
        { ...queueData, url },
        {
          jobId: jobId,
          url: url,
          timeout: parseInt(process.env.JOB_TIMEOUT ?? (1000 * 60 * 60 * 2).toString())
        },
      );
      res.setHeader("Content-Type", "application/json");
      // return the job id so the user can check on it later
      res.end(JSON.stringify({ id: job.id, url: url }));
    } else {
      res.setHeader("Content-Type", "application/json");
      res.status(503).end(JSON.stringify({ error: "Redis service is unavailable" }));
    }
  } catch (error) {
    next(error);
  }
};

async function storeQueryResponse(jobID, response, logLevel = null) {
  // const lock = await redisClient.client.lock();
  return await redisClient.client.usingLock([`asyncQueryResult:lock:${jobID}`], 600000, async (signal) => {
    const defaultExpirySeconds = String(30 * 24 * 60 * 60); // 30 days
    const entries = [];
    if (typeof response === "undefined") {
      return;
    }
    // encode each property separately (accessible separately)
    await Promise.all(
      Object.entries(response).map(async ([key, value]) => {
        if (typeof value === "undefined") {
          return;
        }
        const input = Readable.from(JSON.stringify(value));
        await new Promise(resolve => {
          let i = 0;
          input
            // .pipe(encoder)
            .pipe(chunker(10000000, { flush: true }))
            .on("data", async chunk => {
              await redisClient.client.hsetTimeout(
                `asyncQueryResult:${jobID}:${key}`,
                String(i++),
                lz4.encode(chunk).toString("base64url"),
              );
            })
            .on("end", () => {
              resolve();
            });
        });
        await redisClient.client.expireTimeout(
          `asyncQueryResult:${jobID}:${key}`,
          process.env.ASYNC_COMPLETED_EXPIRE_TIME || defaultExpirySeconds,
        );
        entries.push(key);
      }),
    );
    // register all keys so they can be properly retrieved
    await redisClient.client.setTimeout(`asyncQueryResult:entries:${jobID}`, JSON.stringify(entries));
    await redisClient.client.expireTimeout(
      `asyncQueryResult:entries:${jobID}`,
      process.env.ASYNC_COMPLETED_EXPIRE_TIME || defaultExpirySeconds,
    );
    // remember log_level setting from original query
    await redisClient.client.setTimeout(`asyncQueryResult:logLevel:${jobID}`, JSON.stringify(logLevel));
    await redisClient.client.expireTimeout(
      `asyncQueryResult:logLevel:${jobID}`,
      process.env.ASYNC_COMPLETED_EXPIRE_TIME || defaultExpirySeconds,
    );

  });
}

exports.getQueryResponse = async (jobID, logLevel = null) => {
  return await redisClient.client.usingLock([`asyncQueryResult:lock:${jobID}`], 600000, async (signal) => {
    const entries = await redisClient.client.getTimeout(`asyncQueryResult:entries:${jobID}`);
    if (!entries) {
      return null;
    }
    const originalLogLevel = JSON.parse(await redisClient.client.getTimeout(`asyncQueryResult:logLevel:${jobID}`));
    const values = await Promise.all(
      JSON.parse(entries).map(async key => {
        const value = await new Promise(async resolve => {
          const msgDecoded = Object.entries(await redisClient.client.hgetallTimeout(`asyncQueryResult:${jobID}:${key}`))
            .sort(([key1], [key2]) => parseInt(key1) - parseInt(key2))
            .map(([key, val]) => lz4.decode(Buffer.from(val, "base64url")).toString(), "");

          const msgStream = Readable.from(msgDecoded);
          const pipeline = msgStream.pipe(parser());
          const asm = Assembler.connectTo(pipeline);
          asm.on("done", asm => resolve(asm.current));
        });
        return [key, value];
      }),
    );
    const response = Object.fromEntries(values);
    if (response.logs && logLevel) {
      utils.filterForLogLevel(response, logLevel);
    } else if (response.logs && originalLogLevel) {
      utils.filterForLogLevel(response, originalLogLevel);
    }
    return response ? response : undefined;
  });
};

exports.asyncqueryResponse = async (handler, callback_url, jobID = null, jobURL = null, queryGraph = null) => {
  let response;
  let callback_response;
  try {
    await handler.query();
    response = handler.getResponse();
    if (jobURL) {
      response.logs.unshift(new LogEntry("INFO", null, `job status available at: ${jobURL}`).getLog());
    }
    if (jobID) {
      await storeQueryResponse(jobID, response, handler.options.logLevel);
    }
  } catch (e) {
    console.error(e);
    //shape error > will be handled below
    response = {
      message: {
        query_graph: queryGraph,
        knowledge_graph: { nodes: {}, edges: {} },
        results: [],
      },
      status: "JobQueuingError",
      description: e.toString(),
      trace: process.env.NODE_ENV === "production" ? undefined : e.stack,
    };
    if (jobID) {
      await storeQueryResponse(jobID, response);
    }
  }
  
  if (callback_url) {
    if (!utils.stringIsAValidUrl(callback_url)) {
      return {
        response: "TRAPI Execution complete",
        status: 200,
        callback: "The callback url must be a valid url",
      };
    }
    try {
      const userAgent = `BTE/${process.env.NODE_ENV === "production" ? "prod" : "dev"} Node/${process.version} ${
        process.platform
      }`;
      callback_response = await axios.post(callback_url, JSON.stringify(response), {
        headers: {
          "Content-Type": "application/json",
          "User-Agent": userAgent,
        },
        timeout: 300000, // 5min
        maxBodyLength: 2 * 1000 * 1000 * 1000, // 2GB
      });
      //console.log(res)
    } catch (e) {
      return {
        response: "TRAPI Execution complete",
        status: e.response?.status,
        callback: `Request failed, received code ${e.response?.status}`,
      };
    }
  } else {
    return {
      response: "TRAPI Execution complete",
      status: 200,
      callback: "Callback url was not provided",
    };
  }
  return {
    response: "TRAPI Execution complete",
    status: callback_response?.status,
    callback: "Data sent to callback_url",
  };
};
