const GraphHelper = require("./helper");
const helper = new GraphHelper();

module.exports = class QueryResult {
    constructor() {
        this.results = [];
    }

    getResults() {
        return this.results;
    }

    _createNodeBindings(record) {
        return {
            [helper._getInputQueryNodeID(record)]: [
                {
                    id: helper._getInputID(record)
                }
            ],
            [helper._getOutputQueryNodeID(record)]: [
                {
                    id: helper._getOutputID(record)
                }
            ]
        }
    }

    _createEdgeBindings(record) {
        return {
            [record.$edge_metadata.trapi_qEdge_obj.getID()]: [
                {
                    id: helper._createUniqueEdgeID(record)
                }
            ]
        }
    }

    update(queryResult) {
        queryResult.map(record => {
            this.results.push(
                {
                    node_bindings: this._createNodeBindings(record),
                    edge_bindings: this._createEdgeBindings(record)
                }
            )
        })
    }
}