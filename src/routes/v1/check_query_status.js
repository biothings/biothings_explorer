const Queue = require('bull');
const redisClient = require('../../utils/cache/redis-client');

let queryQueue;

if(redisClient){
    queryQueue = new Queue('get query graph');
}

const swaggerValidation = require("../../middlewares/validate");

class VCheckQueryStatus {
    setRoutes(app) {
        app.get('/v1/check_query_status/:id', swaggerValidation.validate, async (req, res, next) => {
            //logger.info("query /query endpoint")
            try {
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
                            res.end(JSON.stringify({ id, state, reason  }));
                            return
                        }
                        let returnvalue = job.returnvalue;
                        let response = returnvalue?.response;
                        res.setHeader('Content-Type', 'application/json');
                        res.status(returnvalue?.status);
                        res.end(JSON.stringify({ id, state, returnvalue, progress, reason }));
                    }
                }else{
                    res.status(503).end();
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
}

module.exports = new VCheckQueryStatus();
