const GraphHelper = require("./helper");
const helper = new GraphHelper();

module.exports = class KnowledgeGraph {
    constructor() {
        this.nodes = {};
        this.edges = {};
        this.kg = {
            nodes: this.nodes,
            edges: this.edges
        }
    }

    getNodes() {
        return this.nodes;
    }

    getEdges() {
        return this.edges;
    }

    _createInputNode(record) {
        return {
            [helper._getInputID(record)]: {
                category: helper._getInputCategory(record),
                name: helper._getInputLabel(record)
            }
        }
    }

    _createOutputNode(record) {
        return {
            [helper._getOutputID(record)]: {
                category: helper._getOutputCategory(record),
                name: helper._getOutputLabel(record)
            }
        }
    }

    _createEdge(record) {
        return {
            [helper._createUniqueEdgeID(record)]: {
                predicate: record["$association"].predicate,
                subject: helper._getInputID(record),
                object: helper._getOutputID(record)
            }
        }
    }

    update(queryResult) {
        queryResult.map(record => {
            this.nodes = { ...this.nodes, ...this._createInputNode(record) };
            this.nodes = { ...this.nodes, ...this._createOutputNode(record) };
            this.edges = { ...this.edges, ...this._createEdge(record) };
        })
    }
}