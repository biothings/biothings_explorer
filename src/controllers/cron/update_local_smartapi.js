const debug = require("debug")("bte:biothings-explorer-trapi:cron");
const axios = require("axios");
const fs = require("fs");
var path = require('path');
const cron = require('node-cron');

const getTRAPIWithPredicatesEndpoint = (specs) => {
    const trapi = [];
    let special_cases = []
    specs.map((spec) => {
        try {
            if (
                "info" in spec &&
                "x-translator" in spec.info &&
                spec.info["x-translator"].component === "KP" &&
                "paths" in spec &&
                "/query" in spec.paths &&
                "x-trapi" in spec.info &&
                spec.servers.length &&
                "/predicates" in spec.paths ||
                "/meta_knowledge_graph" in spec.paths ||
                "/1.1/meta_knowledge_graph" in spec.paths
            ) {
                let api = {
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
                }
                // check trapi 1.1 or 1.0
                if (
                    "/meta_knowledge_graph" in spec.paths &&
                    Object.prototype.hasOwnProperty.call(spec.info["x-trapi"], "version") &&
                    spec.info["x-trapi"].version.includes("1.1")
                ) {
                    //1.1
                    api['predicates_path'] = "/meta_knowledge_graph";
                    trapi.push(api);
                }
                else if (
                    "/1.1/meta_knowledge_graph" in spec.paths &&
                    Object.prototype.hasOwnProperty.call(spec.info["x-trapi"], "version") &&
                    spec.info["x-trapi"].version.includes("1.1")
                ) {
                    //1.1
                    api['predicates_path'] = "/1.1/meta_knowledge_graph";
                    trapi.push(api);
                    special_cases.push({name: spec.info['title'], id: spec['_id']})
                } else if ("/predicates" in spec.paths ){
                    //1.0
                    api['predicates_path'] = "/predicates";
                    trapi.push(api);
                } else {
                    debug(
                        `[error]: Unable to parse spec, ${spec ? spec.info.title : spec
                        }. Endpoint required not found.`
                    );
                }
            }
        } catch (err) {
            debug(
                `[error]: Unable to parse spec, ${spec ? spec.info.title : spec
                }. Error message is ${err.toString()}`
            );
        }
    });
    if (special_cases.length) {
        debug(
            `Found some APIs with unexpected endpoint "/1.1/meta_knowledge_graph":`
        );
        debug(`${JSON.stringify(special_cases)}`);
    }
    return trapi;
}

const constructQueryUrl = (serverUrl, path) => {
    if (serverUrl.endsWith("/")) {
        serverUrl = serverUrl.slice(0, -1);
    }
    return serverUrl + path;
}

const getPredicatesFromGraphData = (predicate_endpoint, data) => {
    //if /predicates just return normal response
    if (!['/meta_knowledge_graph', '/1.1/meta_knowledge_graph'].includes(predicate_endpoint)) {
        return data
    }
    // transform graph data to legacy format > object.subject : predicates
    const predicates = {}

    const addNewPredicates= (edge) => {
        if (!Object.prototype.hasOwnProperty.call(predicates, edge.object)) {
            predicates[edge.object] = {}
        }
        if (Array.isArray(predicates[edge.object][edge.subject])) {
            predicates[edge.object][edge.subject].push(edge.predicate);
        } else {
            predicates[edge.object][edge.subject] = [edge.predicate];
        }
    }

    if (Object.prototype.hasOwnProperty.call(data, "edges")){
        data.edges.forEach(edge => addNewPredicates(edge))
    }else{
        //some apis still redirect to previous format
        return data
    }
    return predicates
}

const getOpsFromEndpoint = async (metadata) => {
    return axios
        .get(constructQueryUrl(metadata.query_operation.server, metadata.predicates_path), { timeout: 5000 })
        .then((res) => {
            if (res.status === 200) {
                debug(`Successfully got ${metadata.predicates_path} for ${metadata.query_operation.server}`)
                return { ...metadata, ...{ predicates: getPredicatesFromGraphData(metadata.predicates_path, res.data) } };
            }
            debug(
                `[error]: API "${metadata.association.api_name}" Unable to get ${metadata.predicates_path}` +
                ` for ${metadata.query_operation.server} due to query failure with status code ${res.status}`
            );
            return false;
        })
        .catch((err) => {
            debug(
                `[error]: API "${metadata.association.api_name}" failed to get ${metadata.predicates_path} for ${metadata.query_operation.server
                } due to error ${err.toString()}`
            );
            return false;
        });
}

const getOpsFromPredicatesEndpoints = async (specs) => {
    const metadatas = getTRAPIWithPredicatesEndpoint(specs);
    let res = [];
    debug(`Lining up ${metadatas.length} items to get predicates from`);
    await Promise.allSettled(
        metadatas.map((metadata) => getOpsFromEndpoint(metadata))
    ).then((results) => {
        results.map((rec) => {
            if (rec.status === "fulfilled" && rec.value) {
                res.push(rec.value);
            }
        });
    });
    debug(`Got ${res.length} successful requests`);
    return res;
}

const updateSmartAPISpecs = async () => {
    const SMARTAPI_URL = 'https://smart-api.info/api/query?q=tags.name:translator&size=150&fields=paths,servers,tags,components.x-bte*,info,_meta';
    const res = await axios.get(SMARTAPI_URL);
    const localFilePath = path.resolve(__dirname, '../../../data/smartapi_specs.json');
    const predicatesFilePath = path.resolve(__dirname, '../../../data/predicates.json');
    fs.writeFile(localFilePath, JSON.stringify({hits: res.data.hits}), (err) => {
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
            debug("Successfully updated the local copy of SmartAPI specs.")
        } catch (err) {
            debug(`Updating local copy of SmartAPI specs failed! The error message is ${err.toString()}`)
        }
    });
}
