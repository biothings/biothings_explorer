const path = require("path");
const TRAPIGraphHandler = require("@biothings-explorer/query_graph_handler");
const smartAPIPath = path.resolve(
  __dirname,
  process.env.STATIC_PATH
    ? `${process.env.STATIC_PATH}/data/smartapi_specs.json`
    : "../../../../data/smartapi_specs.json",
);
const predicatesPath = path.resolve(
  __dirname,
  process.env.STATIC_PATH ? `${process.env.STATIC_PATH}/data/predicates.json` : "../../../../data/predicates.json",
);
const { asyncqueryResponse } = require("../asyncquery");
const utils = require("../../../utils/common");
const { API_LIST: apiList } = require("../../../config/apis");
const { checkIfZombified } = require("../../../utils/checkIfZombified");

async function jobToBeDone(
  jobID,
  queryGraph,
  smartAPIID,
  enableIDResolution,
  workflow,
  callback_url,
  options,
  jobURL = null,
) {
  checkIfZombified();

  global.queryInformation = {
    jobID,
    queryGraph,
    callback_url,
  };

  utils.validateWorkflow(workflow);
  const handler = new TRAPIGraphHandler.TRAPIQueryHandler(
    {
      apiList,
      smartAPIID,
      enableIDResolution,
      ...options,
    },
    smartAPIPath,
    predicatesPath,
    false,
  );
  handler.setQueryGraph(queryGraph);
  return await asyncqueryResponse(handler, callback_url, jobID, jobURL, queryGraph);
}

module.exports = async job => {
  return await jobToBeDone(
    job.id,
    job.data.queryGraph,
    job.data.smartAPIID,
    job.data.enableIDResolution,
    job.data.workflow,
    job.data.callback_url,
    job.data.options,
    job.data.url,
  );
};
