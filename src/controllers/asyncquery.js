const axios = require('axios')
const { customAlphabet } = require('nanoid')
const utils = require('../utils/common')

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

exports.asyncqueryResponse = async (handler, webhook_url) => {
    let response = null
    try{
        await handler.query();
        response = handler.getResponse();
    }catch (e){
        console.error(e)
        return {
            response: response,
            status: 400,
            callback: ''
        }
    }
    if(webhook_url){
        if(!utils.stringIsAValidUrl(webhook_url)){
            return {
                response: response,
                status: 200,
                callback: 'The callback url must be a valid url'
            }
        }
        try{
            const res = await axios.post(webhook_url, JSON.stringify(response), {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            //console.log(res)
        }catch (e){
            return {
                response: response,
                status: 200,
                callback: `Request failed, received code ${e.response.status}`
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
        status: 200,
        callback: 'Data sent to callback_url'
    };
}