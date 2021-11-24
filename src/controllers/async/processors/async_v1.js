const path = require("path");
const config = require("../../../routes/v1/config");
const TRAPIGraphHandler = require("@biothings-explorer/query_graph_handler");
const smartAPIPath = path.resolve(__dirname, "../../../../data/smartapi_specs.json");
const predicatesPath = path.resolve(__dirname, "../../../../data/predicates.json");
const utils = require("../../../utils/common");
const { asyncqueryResponse } = require("../asyncquery");

async function jobToBeDone(queryGraph, caching, workflow, callback_url) {
    utils.validateWorkflow(workflow);
    const handler = new TRAPIGraphHandler.TRAPIQueryHandler(
        { apiList: config.API_LIST, caching: caching },
        smartAPIPath,
        predicatesPath,
    );
    handler.setQueryGraph(queryGraph);
    const result = await asyncqueryResponse(handler, callback_url);
    return result;
}

module.exports = async (job) => {
    return await jobToBeDone(job.data.queryGraph, job.data.caching, job.data.workflow, job.data.callback_url);
};
