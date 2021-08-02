const Queue = require('bull');
const queryQueue = new Queue('get query graph');

const swaggerValidation = require("../../middlewares/validate");

class VCheckQueryStatus {
    setRoutes(app) {
        app.post('/v1/check_query_status/:id', swaggerValidation.validate, async (req, res, next) => {
            //logger.info("query /query endpoint")
            try {
                let id = req.params.id;
                let job = await queryQueue.getJobFromId(id);

                if (job === null) {
                    res.status(404).end();
                } else {
                    let state = await job.getState();
                    let progress = job._progress;
                    let reason = job.failedReason;
                    let returnvalue = job.returnvalue;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ id, state, returnvalue, progress, reason }));
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
}

module.exports = new VCheckQueryStatus();
