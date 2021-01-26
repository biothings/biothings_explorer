const meta_kg = require("@biothings-explorer/smartapi-kg");

const BatchEdgeQueryHandler = require("./batch_edge_query");
const QueryGraph = require("./query_graph")
const KnowledgeGraph = require("./knowledge_graph");
const QueryResults = require("./query_results");
const InvalidQueryGraphError = require("../../utils/errors/invalid_query_graph_error");

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
            await kg.constructMetaKG(false);
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
        const kg = await this._loadMetaKG(this.smartapiID, this.team);
        let queryPaths = this._processQueryGraph(this.queryGraph);
        const handlers = this._createBatchEdgeQueryHandlers(queryPaths, kg);
        for (let i = 0; i < Object.keys(handlers).length; i++) {
            let res = await handlers[i].query(handlers[i].qEdges);
            this.logs = [...this.logs, ...handlers[i].logs];
            handlers[i].notify(res);
        }
    }
}