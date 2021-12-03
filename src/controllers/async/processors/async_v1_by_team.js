const path = require("path");
const TRAPIGraphHandler = require("@biothings-explorer/query_graph_handler");
const smartAPIPath = path.resolve(__dirname, '../../../../data/smartapi_specs.json');
const predicatesPath = path.resolve(__dirname, '../../../../data/predicates.json');
const { asyncqueryResponse } = require('../asyncquery');
const utils = require("../../../utils/common");

async function jobToBeDone(queryGraph, teamName, caching, enableIDResolution, workflow, callback_url){
    utils.validateWorkflow(workflow);
    const handler = new TRAPIGraphHandler.TRAPIQueryHandler(
        {
            teamName,
            caching,
            enableIDResolution
        },
        smartAPIPath,
        predicatesPath,
        false
    );
    handler.setQueryGraph(queryGraph);
    return await asyncqueryResponse(handler, callback_url);
}

module.exports = async (job) => {
    return await jobToBeDone(
        job.data.queryGraph,
        job.data.teamName,
        job.data.caching,
        job.data.enableIDResolution,
        job.data.workflow,
        job.data.callback_url,
    );
};
