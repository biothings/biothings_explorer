const axios = require('axios');
const { customAlphabet } = require('nanoid');
const utils = require('../../utils/common');
const redisClient = require('@biothings-explorer/query_graph_handler').redisClient;
const async = require('async');
const LogEntry = require("@biothings-explorer/query_graph_handler").LogEntry;
const lz4 = require('lz4');
const { Readable } = require('stream');
const chunker = require('stream-chunker');
const { parser } = require('stream-json');
const Assembler = require('stream-json/Assembler');

exports.asyncquery = async (req, res, next, queueData, queryQueue) => {
    try {
        if (queryQueue) {
            const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 10)

            let jobId = nanoid();

            // add job to the queue
            let url
            if (queryQueue.name==='bte_query_queue_by_api') {
                jobId = `BA_${jobId}`
            }
            if (queryQueue.name==='bte_query_queue_by_team') {
                jobId = `BT_${jobId}`
            }
            url = `${req.protocol}://${req.header('host')}/v1/check_query_status/${jobId}`

            let job = await queryQueue.add(
                {...queueData, url },
                {
                    jobId: jobId,
                    url: url
                });
            res.setHeader('Content-Type', 'application/json');
            // return the job id so the user can check on it later
            res.end(JSON.stringify({ id: job.id, url: url }));
        }else{
            res.setHeader('Content-Type', 'application/json');
            res.status(503).end(JSON.stringify({'error': 'Redis service is unavailable'}));
        }
    }
    catch (error) {
        next(error);
    }
}

async function storeQueryResponse(jobID, response) {
    const unlock = await redisClient.lock(`asyncQueryResult${jobID}Lock`);
    try {
        // workflow
        await redisClient.setAsync(`asyncQueryResult_${jobID}_workflow`, JSON.stringify(response.workflow));
        // message
        const input = Readable.from(JSON.stringify(response.message));
        const encoder = lz4.createEncoderStream(); // TODO get block size setting working!?
        await new Promise((resolve) => {
            let i = 0;
            input
            // .pipe(encoder)
            .pipe(chunker(10000000, {flush: true}))
            .on("data", async chunk => {
                await redisClient.hsetAsync(`asyncQueryResult_${jobID}_message`, String(i++), lz4.encode(chunk).toString('base64url'));
            })
            .on('end', () => {
                resolve()
            });
        })
        // logs
        await redisClient.setAsync(`asyncQueryResult_${jobID}_logs`, lz4.encode(JSON.stringify(response.logs)).toString('base64url'));
        // expiry
        const defaultExpirySeconds = 7 * 24 * 60 * 60 // one 7-day week
        await redisClient.expireAsync(`asyncQueryResult_${jobID}_workflow`, process.env.ASYNC_COMPLETED_EXPIRE_TIME || defaultExpirySeconds);
        await redisClient.expireAsync(`asyncQueryResult_${jobID}_message`, process.env.ASYNC_COMPLETED_EXPIRE_TIME || defaultExpirySeconds);
        await redisClient.expireAsync(`asyncQueryResult_${jobID}_logs`, process.env.ASYNC_COMPLETED_EXPIRE_TIME || defaultExpirySeconds);
    } finally {
        unlock();
    }
}

exports.getQueryResponse = async jobID => {
    const unlock = await redisClient.lock(`asyncQueryResult${jobID}Lock`);
    try {
        const workflow = JSON.parse(await redisClient.getAsync(`asyncQueryResult_${jobID}_workflow`));
        if (!workflow) {
            return null;
        }
        const message = await new Promise(async (resolve, reject) => {
            const msgDecoded = Object.entries(await redisClient.hgetallAsync(`asyncQueryResult_${jobID}_message`))
                .sort(([key1], [key2]) => parseInt(key1) - parseInt(key2))
                .map(([key, val]) => lz4.decode(Buffer.from(val, "base64url")).toString(), "");

            const msgStream = Readable.from(msgDecoded);
            const pipeline = msgStream.pipe(parser());
            const asm = Assembler.connectTo(pipeline);
            asm.on("done", asm => resolve(asm.current));
        });
        const logs = JSON.parse(
            lz4.decode(Buffer.from(await redisClient.getAsync(`asyncQueryResult_${jobID}_logs`), "base64url")),
        );
        const response = {
            workflow: workflow,
            message: message,
            logs: logs,
        };
        return response ? response : undefined;
    } finally {
        unlock();
    }
};

exports.asyncqueryResponse = async (handler, callback_url, jobID = null, jobURL = null) => {
    let response;
    let callback_response;
    try {
        await handler.query();
        response = handler.getResponse();
        if (jobURL) {
            response.logs.unshift(new LogEntry('DEBUG', null, `job status available at: ${jobURL}`).getLog());
        }
        if (jobID) {
            await storeQueryResponse(jobID, response);
        }
    } catch (e) {
        console.error(e)
        //shape error > will be handled below
        response = {
            error: e?.name,
            message: e?.message,
            trace: process.env.NODE_ENV === 'production' ? undefined : e?.stack
        };
    }
    if (callback_url) {
        if (!utils.stringIsAValidUrl(callback_url)) {
            return {
                response: true,
                status: 200,
                callback: 'The callback url must be a valid url'
            }
        }
        try {
            callback_response = await axios.post(callback_url, JSON.stringify(response), {
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 300000,   // 5min
                maxBodyLength: 2 * 1000 * 1000 * 1000 // 2GB
            });
            //console.log(res)
        } catch (e) {
            return {
                response: true,
                status: e.response?.status,
                callback: `Request failed, received code ${e.response?.status}`
            }
        }
    } else {
        return {
            response: true,
            status: 200,
            callback: 'Callback url was not provided'
        };
    }
    return {
        response: true,
        status: callback_response?.status,
        callback: 'Data sent to callback_url'
    };
}
