const path = require("path");
const TRAPIGraphHandler = require("@biothings-explorer/query_graph_handler");
const smartAPIPath = path.resolve(__dirname, process.env.STATIC_PATH ? `${process.env.STATIC_PATH}/data/smartapi_specs.json` : '../../../../data/smartapi_specs.json');
const predicatesPath = path.resolve(__dirname, process.env.STATIC_PATH ? `${process.env.STATIC_PATH}/data/predicates.json` : '../../../../data/predicates.json');
const { asyncqueryResponse } = require('../asyncquery');
const utils = require("../../../utils/common");

async function jobToBeDone(jobID, queryGraph, smartAPIID, caching, enableIDResolution, workflow, callback_url, jobURL = null){
    utils.validateWorkflow(workflow);
    const handler = new TRAPIGraphHandler.TRAPIQueryHandler(
        {
            smartAPIID,
            caching,
            enableIDResolution
        },
        smartAPIPath,
        predicatesPath,
        false
    );
    handler.setQueryGraph(queryGraph);
    return await asyncqueryResponse(handler, callback_url, jobID, jobURL);
}

module.exports = async (job) => {
    return await jobToBeDone(
            job.data.id,
            job.data.queryGraph,
            job.data.smartAPIID,
            job.data.caching,
            job.data.enableIDResolution,
            job.data.workflow,
            job.data.callback_url,
            job.data.url,
        );
}
