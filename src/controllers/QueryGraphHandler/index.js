const BatchEdgeQueryHandler = require("./batch_edge_query");
const QueryGraph = require("./query_graph")
const KnowledgeGraph = require("./knowledge_graph");
const QueryResults = require("./query_results");
const InvalidQueryGraphError = require("../../utils/errors/invalid_query_graph_error");

module.exports = class TRAPIQueryHandler {
    constructor() {
        this.logs = [];
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
        let queryGraphHandler = new QueryGraph(queryGraph);
        let res = queryGraphHandler.createQueryPaths();
        this.logs = [...this.logs, ...queryGraphHandler.logs];
        return res;
    }

    _createBatchEdgeQueryHandlers(queryPaths) {
        let handlers = {};
        for (const index in queryPaths) {
            handlers[index] = new BatchEdgeQueryHandler();
            handlers[index].setEdges(queryPaths[index]);
            handlers[index].subscribe(this.knowledgeGraph);
            handlers[index].subscribe(this.queryResults);
        };
        return handlers;
    }

    async query() {
        this._initializeResponse();
        let queryPaths;
        try {
            queryPaths = this._processQueryGraph(this.queryGraph);
        } catch (err) {
            if (err instanceof InvalidQueryGraphError) {
                throw err;
            } else {
                throw new InvalidQueryGraphError();
            }
        }

        const handlers = this._createBatchEdgeQueryHandlers(queryPaths);
        for (let i = 0; i < Object.keys(handlers).length; i++) {
            let handler = handlers[i];
            let res = await handler.query(handler.qEdges);
            this.logs = [...this.logs, ...handler.logs];
            handler.notify(res);
        }
    }
}