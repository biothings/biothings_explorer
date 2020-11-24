const QNode = require("./query_node");
const QEdge = require("./query_edge");
const _ = require("lodash");
const MAX_DEPTH = 3;

module.exports = class QueryGraphHandler {
    constructor(queryGraph) {
        this.queryGraph = queryGraph;
    }

    /**
     * @private
     */
    _storeNodes() {
        let nodes = {};
        for (let node_id in this.queryGraph.nodes) {
            nodes[node_id] = new QNode(node_id, this.queryGraph.nodes[node_id])
        }
        return nodes;
    }

    /**
     * @private
     */
    _storeEdges() {
        if (this.nodes === undefined) {
            this.nodes = this._storeNodes();
        }
        let edges = {};
        for (let edge_id in this.queryGraph.edges) {
            let edge_info = {
                ...this.queryGraph.edges[edge_id],
                ...{
                    subject: this.nodes[this.queryGraph.edges[edge_id].subject],
                    object: this.nodes[this.queryGraph.edges[edge_id].object]
                }
            }
            edges[edge_id] = new QEdge(edge_id, edge_info);
        };
        return edges;
    }

    /**
     * 
     */
    createQueryPaths() {
        let paths = {};
        let FirstLevelEdges = this._findFirstLevelEdges();
        paths[0] = FirstLevelEdges.paths;
        let output_nodes = FirstLevelEdges.output_nodes;
        for (let i = 1; i < MAX_DEPTH; i++) {
            let ithLevelEdges = this._findNextLevelEdges(output_nodes);
            output_nodes = ithLevelEdges.output_nodes;
            if (output_nodes.length === 0) {
                break;
            }
            paths[i] = ithLevelEdges.paths;
        }
        return paths;
    }

    /**
     * @private
     */
    _findFirstLevelEdges() {
        if (this.edges === undefined) {
            this.edges = this._storeEdges();
        };
        let result = {
            paths: [],
            output_nodes: []
        };
        for (let edge_id in this.edges) {
            let subjectNode = this.edges[edge_id].getSubject();
            let objectNode = this.edges[edge_id].getObject();
            if (subjectNode.hasInput()) {
                result.paths.push(this.edges[edge_id]);
                result.output_nodes.push(objectNode);
                continue;
            }
            if (objectNode.hasInput()) {
                result.paths.push(this.edges[edge_id]);
                result.output_nodes.push(subjectNode);
            }
        }
        return result;
    }


    /**
     * @private
     */
    _findNextLevelEdges(input_nodes) {
        if (this.edges === undefined) {
            this.edges = this._storeEdges();
        };
        let result = {
            paths: [],
            output_nodes: []
        };
        const input_node_ids = input_nodes.map(item => item.getID());
        for (const edge_id in this.edges) {
            let subjectNode = this.edges[edge_id].getSubject();
            let objectNode = this.edges[edge_id].getObject();
            if (input_node_ids.includes(subjectNode.getID())) {
                result.paths.push(this.edges[edge_id]);
                result.output_nodes.push(objectNode);
            }
        }
        return result;
    }
}