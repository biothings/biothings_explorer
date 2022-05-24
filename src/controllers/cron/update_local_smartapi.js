const debug = require("debug")("bte:biothings-explorer-trapi:cron");
const axios = require("axios");
const fs = require("fs");
var path = require('path');
const cron = require('node-cron');
const util = require("util");
const readFile = util.promisify(fs.readFile);
const yaml = require("js-yaml");
var url = require('url')
const validUrl = require('valid-url')
const config = require("../../config/smartapi_exclusions");
const overrides = require('../../config/smartapi_overrides.js').overrides;

const userAgent = `BTE/${process.env.NODE_ENV === 'production' ? 'prod' : 'dev'} Node/${process.version} ${process.platform}`;

const getTRAPIWithPredicatesEndpoint = (specs) => {
    const trapi = [];
    let excluded_list = config.EXCLUDE_LIST.map((api) => api.id);
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
                "/meta_knowledge_graph" in spec.paths &&
                !excluded_list.includes(spec._id)
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
                // check TRAPI latest accepted version
                if ("/meta_knowledge_graph" in spec.paths) {
                    if (
                        (Object.prototype.hasOwnProperty.call(spec.info["x-trapi"], "version") &&
                        spec.info["x-trapi"].version.includes("1.1")) ||
                        (Object.prototype.hasOwnProperty.call(spec.info["x-trapi"], "version") &&
                        spec.info["x-trapi"].version.includes("1.2"))
                    ) {
                        api['predicates_path'] = "/meta_knowledge_graph";
                        trapi.push(api);
                    }
                }
                else {
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
    if (predicate_endpoint !== '/meta_knowledge_graph') {
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
    debug(`Now caching predicates from ${metadatas.length} TRAPI APIs`);
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
    const SMARTAPI_URL = 'https://smart-api.info/api/query?q=tags.name:translator&size=200&sort=_seq_no&raw=1&fields=paths,servers,tags,components.x-bte*,info,_meta';
    const res = await axios.get(SMARTAPI_URL, { headers: { 'User-Agent': userAgent } });
    const localFilePath = path.resolve(__dirname, '../../../data/smartapi_specs.json');
    const predicatesFilePath = path.resolve(__dirname, '../../../data/predicates.json');
    const writeFunc = process.env.SYNC_AND_EXIT === "true" ? fs.writeFileSync : fs.writeFile;
    if (process.env.API_OVERRIDE === "true") {
        await getAPIOverrides(res.data);
    }
    debug(`Retrieved ${res.data.total} SmartAPI records`);
    //clean _score fields
    const hits = res.data.hits;
    hits.forEach(function(obj){ delete obj._score });
    writeFunc(localFilePath, JSON.stringify({ hits: hits }), (err) => {
        if (err) throw err;
    });
    const predicatesInfo = await getOpsFromPredicatesEndpoints(res.data.hits);
    writeFunc(predicatesFilePath, JSON.stringify(predicatesInfo), (err) => {
        if (err) throw err;
    });
}

const getAPIOverrides = async (data) => {
    const overrideHits = await Promise.all(Object.keys(overrides.apis).map(async (id) => {
        let override;
        try {
            const filepath = path.resolve(url.fileURLToPath(overrides.apis[id]));
            override = yaml.load(await readFile(filepath));
        } catch (e1) {
            if (e1 instanceof TypeError) {
                if (validUrl.isWebUri(overrides.apis[id])) {
                    try {
                        override = yaml.load((await axios.get(overrides.apis[id])).data, { headers: { 'User-Agent': userAgent } });
                    } catch (weberror) {
                        debug(`ERROR getting URL-hosted override for API ID ${id} because ${weberror}`);
                        return;
                    }
                } else {
                    try {
                        const filepath = path.resolve(overrides.apis[id]);
                        override = yaml.load(await readFile(filepath));
                    } catch (filerror) {
                        debug(`ERROR getting local file override for API ID ${id} because ${filerror}`);
                        return;
                    }
                }
            } else {
              debug(`ERROR getting 'file:///' override for API ID ${id} because ${e1}`);
              return;
            }
        }
        debug(`Successfully got override ${id} from ${overrides.apis[id]}`)
        override._id = id;
        override._meta = {
            date_created: undefined,
            last_updated: undefined,
            url: overrides.apis[id],
            username: undefined,
        };
        return override
    }));

    const overrideIDs = [];

    // add overrides to hits
    overrideHits.forEach((override) => {
        const index = overrides.config.only_overrides ? -1 : data.hits.findIndex(hit => hit._id === id);
        if (index === -1) {
            debug(`[warning] Overridden API ID ${override._id} not recognized, appending as new API hit.`);
            data.hits.push(override);
        } else {
            data.hits[index] = override;
        }
        overrideIDs.push(override._id);
    })

    // if only_overrides is enabled, only overridden apis are used
    if (overrides.config.only_overrides) {
        debug("Override specifies removal of undeclared APIs")
        data.hits = data.hits.filter((hit) => {
            return overrideIDs.includes(hit._id);
        });
    }
};


module.exports = () => {
    // not meant to be used with server started
    // rather, if just this function is imported and run (e.g. using workspace script)
    let sync_and_exit = process.env.SYNC_AND_EXIT === 'true';
    if (sync_and_exit) {
        console.log("Syncing SmartAPI specs with subsequent exit...");
        updateSmartAPISpecs().then(() => {
            console.log("SmartAPI sync successful.");
            process.exit(0);
        });
        return;
    }

    let schedule_sync = process.env.NODE_ENV === 'production';
    let manual_sync = process.env.SMARTAPI_SYNC === 'true'
        ? true : process.env.SMARTAPI_SYNC === 'false'
            ? false
            : undefined;
    let api_override = process.env.API_OVERRIDE === 'true';
    disable_smartapi_sync = !(manual_sync || (schedule_sync && typeof manual_sync === "undefined"));
    if (disable_smartapi_sync) {
        debug(`SmartAPI sync disabled, server process ${process.pid} disabling smartapi updates.`);
    } else {
        if (process.env.INSTANCE_ID){
            // check if it's a PM2 cluster node and in this case,
            // only instance #0 will sync from SmartAPI
            disable_smartapi_sync = process.env.INSTANCE_ID !== "0";
            if (disable_smartapi_sync) {
                debug(`Running as a children process, server process ${process.pid} disabling smartapi updates.`);
            }
        }
    }

    if (!disable_smartapi_sync) {
        cron.schedule('*/10 * * * *', async () => {
            debug(`Updating local copy of SmartAPI specs now at ${new Date().toUTCString()}!`);
            try {
                await updateSmartAPISpecs();
                debug("Successfully updated the local copy of SmartAPI specs.")
            } catch (err) {
                debug(`Updating local copy of SmartAPI specs failed! The error message is ${err.toString()}`)
            }
        });

        if (api_override) {
            if (Object.keys(overrides.apis).length > 0) {
                debug(`API Override(s) set. Updating local SmartAPI specs with overrides now at ${new Date().toUTCString()}!`);
                try {
                    updateSmartAPISpecs();
                } catch (error) {
                    debug(`Updating local copy of SmartAPI specs failed! The error message is ${err.toString()}`)
                }
            }
        }
    }
}
