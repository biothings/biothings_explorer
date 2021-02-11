const meta_kg = require("@biothings-explorer/smartapi-kg");
const fs = require("fs");
var path = require('path');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const BatchEdgeQueryHandler = require("./batch_edge_query");
const QueryGraph = require("./query_graph")
const KnowledgeGraph = require("./knowledge_graph");
const QueryResults = require("./query_results");
const InvalidQueryGraphError = require("../../utils/errors/invalid_query_graph_error");
const debug = require("debug")("biothings-explorer-trapi:main");


module.exports = class TRAPIQueryHandler {
    constructor(smartapiID = undefined, team = undefined, resolveOutputIDs = true) {
        this.logs = [];
        this.smartapiID = smartapiID;
        this.team = team;
        this.resolveOutputIDs = resolveOutputIDs;
    }

    async _loadMetaKG(smartapiID, team) {
        const kg = new meta_kg();
        if (smartapiID === undefined && team === undefined) {
            debug("loading specs without smartapiID and team info.")
            const smartapi_specs = await readFile(path.resolve(__dirname, '../../../data/smartapi_specs.json'));
            debug("smartapi specs read from local file")
            const data = JSON.parse(smartapi_specs);
            debug("smartapi specs parsed into JSON from local file");
            kg.constructMetaKGFromUserProvidedSpecs(data);
            debug(`Total number of ops loaded: ${kg.ops.length}`);
        };
        if (smartapiID !== undefined) {
            await kg.constructMetaKG(false, "translator", smartapiID);
        }
        if (team !== undefined) {
            await kg.constructMetaKG(false, "translator", undefined, team)
        }
        return kg;
    }

    getResponse() {
        return {
            message: {
                query_graph: this.queryGraph,
                knowledge_graph: this.knowledgeGraph.kg,
                results: this.queryResults.getResults(),
            },
            logs: this.logs
        }
    }

    /**
     * Set TRAPI Query Graph
     * @param {object} queryGraph - TRAPI Query Graph Object
     */
    setQueryGraph(queryGraph) {
        this.queryGraph = queryGraph;
    }

    _initializeResponse() {
        this.knowledgeGraph = new KnowledgeGraph();
        this.queryResults = new QueryResults();
    }

    /**
     * @private
     * @param {object} queryGraph - TRAPI Query Graph Object
     */
    _processQueryGraph(queryGraph) {
        try {
            let queryGraphHandler = new QueryGraph(queryGraph);
            let res = queryGraphHandler.createQueryPaths();
            this.logs = [...this.logs, ...queryGraphHandler.logs];
            return res;
        } catch (err) {
            if (err instanceof InvalidQueryGraphError) {
                throw err;
            } else {
                throw new InvalidQueryGraphError();
            }
        }
    }

    _createBatchEdgeQueryHandlers(queryPaths, kg) {
        let handlers = {};
        for (const index in queryPaths) {
            handlers[index] = new BatchEdgeQueryHandler(kg, this.resolveOutputIDs);
            handlers[index].setEdges(queryPaths[index]);
            handlers[index].subscribe(this.knowledgeGraph);
            handlers[index].subscribe(this.queryResults);
        };
        return handlers;
    }

    async query() {
        this._initializeResponse();
        debug('start to load metakg.')
        const kg = await this._loadMetaKG(this.smartapiID, this.team);
        debug("metakg successfully loaded")
        let queryPaths = this._processQueryGraph(this.queryGraph);
        debug(`query paths constructed: ${queryPaths}`);
        const handlers = this._createBatchEdgeQueryHandlers(queryPaths, kg);
        debug(`Query depth is ${Object.keys(handlers).length}`);
        for (let i = 0; i < Object.keys(handlers).length; i++) {
            debug(`Start to query depth ${i + 1}`);
            let res = await handlers[i].query(handlers[i].qEdges);
            debug(`Query for depth ${i + 1} completes.`);
            this.logs = [...this.logs, ...handlers[i].logs];
            if (res.length === 0) {
                return;
            }
            handlers[i].notify(res);
            debug(`Updated TRAPI knowledge graph using query results for depth ${i + 1}`)
        }
    }
}