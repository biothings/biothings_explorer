const axios = require('axios')
const { customAlphabet } = require('nanoid')
const utils = require('../../utils/common')

exports.asyncquery = async (req, res, next, queueData, queryQueue) => {
    try {
        if(queryQueue){
            const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 10)

            const jobId = nanoid();

            // add job to the queue
            let url
            if(queryQueue.name==='get query graph'){
                url = `${req.protocol}://${req.header('host')}/v1/check_query_status/${jobId}`
            }
            if(queryQueue.name==='get query graph by api'){
                url = `${req.protocol}://${req.header('host')}/v1/check_query_status/${jobId}?by=api`
            }
            if(queryQueue.name==='get query graph by team'){
                url = `${req.protocol}://${req.header('host')}/v1/check_query_status/${jobId}?by=team`
            }
            let job = await queryQueue.add(
                queueData,
                {
                    jobId: jobId,
                    url: url
                });
            res.setHeader('Content-Type', 'application/json');
            // return the job id so the user can check on it later
            res.end(JSON.stringify({id: job.id, url: url}));
        }else{
            res.setHeader('Content-Type', 'application/json');
            res.status(503).end(JSON.stringify({'error': 'Redis service is unavailable'}));
        }
    }
    catch (error) {
        next(error);
    }
}

exports.asyncqueryResponse = async (handler, callback_url) => {
    let response = null
    let callback_response = null;
    try{
        await handler.query();
        response = handler.getResponse();
    }catch (e){
        console.error(e)
        //shape error > will be handled below
        response = {
            error: e?.name,
            message: e?.message
        };
    }
    if(callback_url){
        if(!utils.stringIsAValidUrl(callback_url)){
            return {
                response: response,
                status: 200,
                callback: 'The callback url must be a valid url'
            }
        }
        try{
            callback_response = await axios.post(callback_url, JSON.stringify(response), {
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 300000,   // 5min
                maxBodyLength: 2 * 1000 * 1000 * 1000 // 2GB
            });
            //console.log(res)
        }catch (e){
            return {
                response: response,
                status: e.response?.status,
                callback: `Request failed, received code ${e.response?.status}`
            }
        }
    }else{
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
