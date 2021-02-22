const redisClient = require("../../utils/cache/redis-client");
const debug = require("debug")("biothings-explorer-trapi:cache_handler");


module.exports = class {
    constructor(qEdges, logs = []) {
        this.qEdges = qEdges;
        this.logs = logs;
        this.cacheEnabled = (!process.env.REDIS_HOST === undefined) && (!process.env.REDIS_PORT === undefined);
    }

    async categorizeEdges(qEdges) {
        if (this.cacheEnabled === false) {
            return {
                cachedResults: [],
                nonCachedEdges: qEdges
            }
        }
        let nonCachedEdges = [];
        let cachedResults = [];
        for (let i = 0; i < qEdges.length; i++) {
            const hashedEdgeID = qEdges[i].getHashedEdgeRepresentation();
            const cachedRes = await redisClient.getAsync(hashedEdgeID);
            let cachedResJSON = JSON.parse(cachedRes);
            if (cachedResJSON) {
                cachedResJSON.map(rec => {
                    rec.$edge_metadata.trapi_qEdge_obj = qEdges[i];
                });
                cachedResults = [...cachedResults, ...cachedResJSON];
            } else {
                nonCachedEdges.push(qEdges[i]);
            }
        }
        debug(`Number of cached results: ${cachedResults.length}`);
        return { cachedResults, nonCachedEdges };
    }

    _copyRecord(record) {
        debug(`record.$input, ${Object.keys(record.$input)}`)
        const new_record = {
            $edge_metadata: {
                input_id: record.$edge_metadata.input_id,
                output_id: record.$edge_metadata.output_id,
                output_type: record.$edge_metadata.output_type,
                input_type: record.$edge_metadata.input_type,
                predicate: record.$edge_metadata.predicate,
                source: record.$edge_metadata.source,
                api_name: record.$edge_metadata.api_name
            },
            $input: {
                original: record.$input.obj.original,
                obj: {
                    dbIDs: record.$input.obj.dbIDs,
                    curies: record.$input.obj.curies,
                    label: record.$input.obj.label,
                    primaryID: record.$input.obj.primaryID
                }
            },
            $output: {
                original: record.$output.obj.original,
                obj: {
                    dbIDs: record.$output.obj.dbIDs,
                    curies: record.$output.obj.curies,
                    label: record.$output.obj.label,
                    primaryID: record.$output.obj.primaryID
                }
            }
        };
        Object.keys(record).map(k => {
            if (!(["$edge_metadata", "$input", "$output"].includes(k))) {
                new_record[k] = record[k];
            }
        })
        debug(`new record: ${JSON.stringify(new_record)}`);
        return new_record;

    }

    _groupQueryResultsByEdgeID(queryResult) {
        let groupedResult = {};
        queryResult.map(record => {
            const hashedEdgeID = record.$edge_metadata.trapi_qEdge_obj.getHashedEdgeRepresentation();
            if (!(hashedEdgeID in groupedResult)) {
                groupedResult[hashedEdgeID] = [];
            };
            groupedResult[hashedEdgeID].push(this._copyRecord(record));
        })
        return groupedResult;
    }

    async cacheEdges(queryResult) {
        if (this.cacheEnabled === false) {
            return;
        }
        debug("Start to cache query results.")
        const groupedQueryResult = this._groupQueryResultsByEdgeID(queryResult);
        const hashedEdgeIDs = Array.from(Object.keys(groupedQueryResult));
        debug(`Number of hashed edges: ${hashedEdgeIDs.length}`)
        for (let i = 0; i < hashedEdgeIDs.length; i++) {
            await redisClient.setAsync(hashedEdgeIDs[i], JSON.stringify(groupedQueryResult[hashedEdgeIDs[i]]), 'EX', process.env.REDIS_KEY_EXPIRE_TIME);
        }
        debug("Successfully cached all query results.")
    }
}