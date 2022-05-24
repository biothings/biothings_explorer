const path = require("path");
const config = require("../../config/apis.js");
const swaggerValidation = require("../../middlewares/validate");
const { asyncquery } = require('../../controllers/async/asyncquery');
const { getQueryQueue } = require('../../controllers/async/asyncquery_queue');

queryQueue = getQueryQueue('bte_query_queue_by_api')

if (queryQueue) {
    queryQueue.process(path.resolve(__dirname, "../../controllers/async/processors/async_v1_by_api.js"));
}

class V1RouteAsyncQueryByAPI {
    setRoutes(app) {
        app.post('/v1/smartapi/:smartapi_id/asyncquery', swaggerValidation.validate, async (req, res, next) => {
            queryQueue = getQueryQueue('bte_query_queue_by_api')
            // Disabled the disabling of text-mining / multiomics provider APIs -- we're not sure why they were disabled in the first place...
            // const enableIDResolution = (['5be0f321a829792e934545998b9c6afe', '978fe380a147a8641caf72320862697b'].includes(req.params.smartapi_id)) ? false : true;
            let queueData = {
                queryGraph: req.body.message.query_graph,
                smartAPIID: req.params.smartapi_id,
                workflow: req.body.workflow,
                callback_url: req.body.callback_url || req.body['callback'],
                options: {
                    apiList: process.env.IGNORE_API_LIST === 'true' ? undefined : config.API_LIST,
                    logLevel: req.body.log_level,
                    ...req.query
                },
                // enableIDResolution
            }
            await asyncquery(req, res, next, queueData, queryQueue)
        });
    }
}



module.exports = new V1RouteAsyncQueryByAPI();
