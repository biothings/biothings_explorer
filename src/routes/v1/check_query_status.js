const Queue = require('bull');
const redisClient = require('../../utils/cache/redis-client');
const {getQueryQueue} = require('../../controllers/async/asyncquery_queue');

let queryQueue;

const swaggerValidation = require("../../middlewares/validate");

class VCheckQueryStatus {
    setRoutes(app) {
        app.get('/v1/check_query_status/:id', swaggerValidation.validate, async (req, res, next) => {
            //logger.info("query /query endpoint")
            try {
                let id = req.params.id;
                if(Object.keys(redisClient).length !== 0){
                    if(id.startsWith('BT_')){
                        queryQueue = getQueryQueue('bte_query_queue_by_team')
                    } else if(id.startsWith('BA_')){
                        queryQueue = getQueryQueue('bte_query_queue_by_api')
                    }else{
                        queryQueue = getQueryQueue('bte_query_queue')
                    }
                }
                if(queryQueue){
                    let id = req.params.id;
                    let job = await queryQueue.getJobFromId(id);

                    if (job === null) {
                        res.status(404).end();
                    } else {
                        let state = await job.getState();
                        let progress = job._progress;
                        let reason = job.failedReason;
                        if(reason){
                            res.setHeader('Content-Type', 'application/json');
                            if(reason.includes('Promise timed out')){
                                // something might break when calculating process.env.JOB_TIMEOUT so wrap it in try catch
                                try {
                                    // This will always be using the variable from process.env instead of the value that actually timed out during runtime
                                    // To display the true timed out value extract it from "reason"
                                    res.end(JSON.stringify({ id, state,
                                        reason: `This job was stopped after running over ${parseInt(process.env.JOB_TIMEOUT) / 1000}s`  }));
                                }catch (e){
                                    res.end(JSON.stringify({ id, state, reason  }));
                                }
                                return
                            }
                            res.end(JSON.stringify({ id, state, reason  }));
                            return
                        }
                        let returnvalue = job.returnvalue;
                        let response = returnvalue?.response;
                        res.setHeader('Content-Type', 'application/json');
                        res.status(returnvalue?.status || 200);
                        res.end(JSON.stringify({ id, state, returnvalue, progress, reason }));
                    }
                }else{
                    res.setHeader('Content-Type', 'application/json');
                    res.status(503).end(JSON.stringify({'error': 'Redis service is unavailable'}));
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
}

module.exports = new VCheckQueryStatus();
