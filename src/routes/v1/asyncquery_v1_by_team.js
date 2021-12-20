const path = require("path");
const swaggerValidation = require("../../middlewares/validate");
const { asyncquery } = require('../../controllers/async/asyncquery');
const { getQueryQueue } = require('../../controllers/async/asyncquery_queue');

queryQueue = getQueryQueue('bte_query_queue_by_team')

if (queryQueue) {
    queryQueue.process(path.resolve(__dirname, "../../controllers/async/processors/async_v1_by_team.js"));
}

class V1RouteAsyncQueryByTeam {
    setRoutes(app) {
        app.post('/v1/team/:team_name/asyncquery', swaggerValidation.validate, async (req, res, next) => {
            queryQueue = getQueryQueue('bte_query_queue_by_team')
            const queryGraph = req.body.message.query_graph;
            const enableIDResolution = (req.params.team_name === "Text Mining Provider") ? false : true;
            let queueData = {
                queryGraph: queryGraph,
                teamName: req.params.team_name,
                caching: req.query.caching,
                workflow: req.body.workflow,
                callback_url: req.body.callback_url || req.body['callback'],
                enableIDResolution
            }
            await asyncquery(req, res, next, queueData, queryQueue)
        });
    }
}



module.exports = new V1RouteAsyncQueryByTeam();
