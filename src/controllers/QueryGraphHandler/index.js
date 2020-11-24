const BatchEdgeQueryHandler = require("./batch_edge_query");
const QueryGraph = require("./query_graph")
const KnowledgeGraph = require("./knowledge_graph");
const QueryResults = require("./query_results");

module.exports = class TRAPIQueryHandler {
    constructor() {

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
        return queryGraphHandler.createQueryPaths();
    }

    _createBatchEdgeQueryHandlers(queryPaths) {
        let handlers = {};
        queryPaths.forEach((item, index) => {
            handlers[index] = new BatchEdgeQueryHandler();
            handlers[index].setEdges(item);
            handlers[index].subscribe(this.knowledgeGraph);
            handlers[index].subscribe(this.queryResults);
        });
        return handlers;
    }

    async query() {
        this._initializeResponse();
        const queryPaths = this._processQueryGraph(this.queryGraph);
        const handlers = this._createBatchEdgeQueryHandlers(queryPaths);
        for (let i = 0; i < Object.keys(handlers).length; i++) {
            let handler = handlers[i];
            let res = await handler.query(handler.edges);
            handler.notify(res);
        }
    }
}