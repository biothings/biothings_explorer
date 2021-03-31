const debug = require("debug")("biothings-explorer-trapi:cron");
const axios = require("axios");
const fs = require("fs");
var path = require('path');
const cron = require('node-cron');

const getTRAPIWithPredicatesEndpoint = (specs) => {
    const trapi = [];
    specs.map((spec) => {
        try {
            if (
                "info" in spec &&
                "x-translator" in spec.info &&
                spec.info["x-translator"].component === "KP" &&
                "paths" in spec &&
                "/predicates" in spec.paths &&
                "/query" in spec.paths
            ) {
                trapi.push({
                    association: {
                        api_name: spec.info.title,
                        smartapi: {
                            id: spec._id,
                            meta: spec._meta
                        },
                        "x-translator": {
                            component: "KP",
                            team: spec.info["x-translator"].team
                        }
                    },
                    tags: spec.tags.map(item => item.name),
                    query_operation: {
                        path: '/query',
                        server: spec.servers[0].url,
                        method: 'post'
                    }
                });
            }
        } catch (err) {
            debug(
                `[error]: Unable to parse spec, ${spec ? spec.info.title : spec
                }. Error message is ${err.toString()}`
            );
        }
    });
    return trapi;
}

const constructQueryUrl = (serverUrl) => {
    if (serverUrl.endsWith("/")) {
        serverUrl = serverUrl.slice(0, -1);
    }
    return serverUrl + "/predicates";
}

const getOpsFromPredicatesEndpoint = async (metadata) => {
    return axios
        .get(constructQueryUrl(metadata.query_operation.server), { timeout: 5000 })
        .then((res) => {
            if (res.status === 200) {
                debug(`Successfully get /predicates for ${metadata.query_operation.server}`)
                return { ...metadata, ...{ predicates: res.data } };
            }
            debug(
                `[error]: Unable to get /predicates for ${metadata.query_operation.server} due to query failure with status code ${res.status}`
            );
            return [];
        })
        .catch((err) => {
            debug(
                `[error]: Unable to get /predicates for ${metadata.url
                } due to error ${err.toString()}`
            );
            return [];
        });
}

const getOpsFromPredicatesEndpoints = async (specs) => {
    const metadatas = getTRAPIWithPredicatesEndpoint(specs);
    let res = [];
    await Promise.allSettled(
        metadatas.map((metadata) => getOpsFromPredicatesEndpoint(metadata))
    ).then((results) => {
        results.map((rec) => {
            if (rec.status === "fulfilled") {
                res.push(rec.value);
            }
        });
    });
    return res;
}

const updateSmartAPISpecs = async () => {
    const SMARTAPI_URL = 'https://smart-api.info/api/query?q=tags.name:translator&size=150&fields=paths,servers,tags,components.x-bte*,info,_meta';
    const res = await axios.get(SMARTAPI_URL);
    const localFilePath = path.resolve(__dirname, '../../../data/smartapi_specs.json');
    const predicatesFilePath = path.resolve(__dirname, '../../../data/predicates.json');
    fs.writeFile(localFilePath, JSON.stringify(res.data), (err) => {
        if (err) throw err;
    });
    const predicatesInfo = await getOpsFromPredicatesEndpoints(res.data.hits);
    fs.writeFile(predicatesFilePath, JSON.stringify(predicatesInfo), (err) => {
        if (err) throw err;
    });
}
module.exports = () => {
    cron.schedule('*/10 * * * *', async () => {
        debug(`Updating local copy of SmartAPI specs now at ${new Date().toUTCString()}!`);
        try {
            await updateSmartAPISpecs();
            debug("Successfull updated the local copy of SmartAPI specs.")
        } catch (err) {
            debug(`Updating local copy of SmartAPI specs failed! The error message is ${err.toString()}`)
        }
    });
}