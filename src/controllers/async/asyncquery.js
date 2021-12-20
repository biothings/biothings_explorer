const axios = require('axios')
const { customAlphabet } = require('nanoid')
const utils = require('../../utils/common')
const LogEntry = require("@biothings-explorer/query_graph_handler").LogEntry;
const lz4 = require('lz4');

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
            res.end(JSON.stringify({id: job.id, url: url}));
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.status(503).end(JSON.stringify({'error': 'Redis service is unavailable'}));
        }
    }
    catch (error) {
        next(error);
    }
}

exports.asyncqueryResponse = async (handler, callback_url, jobURL = null) => {
    let response = null
    let callback_response = null;
    try {
        await handler.query();
        response = handler.getResponse();
        const responseSize = Buffer.byteLength(JSON.stringify(response));
        if (jobURL) {
            response.logs.unshift(new LogEntry('DEBUG', null, `job status available at: ${jobURL}`).getLog());
        }
        if (responseSize > 5000000) { // compress anything over 5MB
            console.log(`COMPRESSION: ORIGINAL SIZE ${responseSize}`);
            response = lz4.encode(JSON.stringify(response));
            console.log(`COMPRESSION: COMPRESSED SIZE ${Buffer.byteLength(response)}`);
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
                response: response,
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
                response: response,
                status: e.response?.status,
                callback: `Request failed, received code ${e.response?.status}`
            }
        }
    } else {
        return {
            response: response,
            status: 200,
            callback: 'Callback url was not provided'
        };
    }
    return {
        response: response,
        status: callback_response?.status,
        callback: 'Data sent to callback_url'
    };
}
