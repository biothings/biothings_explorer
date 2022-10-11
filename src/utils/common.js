const WorkflowError = require("./errors/workflow_error");
const URL = require("url").URL;
const yaml2json = require('js-yaml');
const fs = require('fs/promises');
const path = require('path');

const schema = [];

exports.getSchema = async () => {
  if (schema.length !== 0) return schema[0];
  schema.push(yaml2json.load(await fs.readFile(path.join(__dirname, '../../docs/smartapi.yaml'), { encoding: 'utf8' })));
  console.log(schema);
  return schema[0];
};

exports.removeQuotesFromQuery = (queryString) => {
    if (queryString.startsWith('"') && queryString.endsWith('"')) {
        return queryString.slice(1, -1);
    } else if (queryString.startsWith("'") && queryString.endsWith("'")) {
        return queryString.slice(1, -1);
    } else {
        return queryString;
    }
}

exports.validateWorkflow = (workflow) => {
    if (workflow === undefined) {
        return;
    }
    if (!Array.isArray(workflow) || workflow.length !== 1 || workflow[0].id !== 'lookup') {
        throw new WorkflowError("BTE doesn't handle the operations specified in the workflow field.");
    }
}

exports.stringIsAValidUrl = (s) => {
    try {
        new URL(s);
        return true;
    } catch (err) {
        return false;
    }
};

exports.filterForLogLevel = (response, logLevel) => {
    const logLevels = {
        ERROR: 3,
        WARNING: 2,
        INFO: 1,
        DEBUG: 0
    }
    if (logLevel && Object.keys(logLevels).includes(logLevel)) {
        response.logs = response.logs.filter(log => {
            return logLevels[log.level] >= logLevels[logLevel]
        });
    }
}

exports.methodNotAllowed = (req, res, next) => res.status(405).send();
