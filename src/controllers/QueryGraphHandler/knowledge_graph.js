const GraphHelper = require("./helper");
const debug = require("debug")("biothings-explorer-trapi:KnowledgeGraph");
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
            category: "biolink:" + helper._getInputCategory(record),
            name: helper._getInputLabel(record),
            attributes: [
                {
                    name: "equivalent_identifiers",
                    value: helper._getInputEquivalentIds(record),
                    type: "biolink:id"
                }
            ]
        }
    }

    _createOutputNode(record) {
        return {
            category: "biolink:" + helper._getOutputCategory(record),
            name: helper._getOutputLabel(record),
            attributes: [
                {
                    name: "equivalent_identifiers",
                    value: helper._getOutputEquivalentIds(record),
                    type: "biolink:id"
                }
            ]
        }
    }

    _createAttributes(record) {
        const bteAttributes = ["@type", "name", "pmc", "pubmed", "label", "id", "api", "provided_by"];
        const attributes = [
            {
                name: "provided_by",
                value: helper._getSource(record),
                type: "biolink:provided_by"
            },
            {
                name: "api",
                value: helper._getAPI(record),
                type: "bts:api"
            }
        ];
        Object.keys(record).filter(k => !(bteAttributes.includes(k) || k.startsWith("$"))).map(item => {
            attributes.push(
                {
                    name: item,
                    value: record[item],
                    type: (item === "publications") ? "biolink:" + item : "bts:" + item
                }
            )
        })
        return attributes;
    }

    _createEdge(record) {
        return {
            predicate: "biolink:" + ((typeof record.$edge_metadata.trapi_qEdge_obj.getQueryPredicate() === "undefined") ? record.$edge_metadata.predicate : record.$edge_metadata.trapi_qEdge_obj.getQueryPredicate()),
            subject: helper._getInputID(record),
            object: helper._getOutputID(record),
            attributes: this._createAttributes(record)
        }
    }

    update(queryResult) {
        queryResult.map(record => {
            debug(`record, ${JSON.stringify(record.$output)}`)
            if (!(helper._getInputID(record) in this.nodes)) {
                this.nodes[helper._getInputID(record)] = this._createInputNode(record);
                debug('input node done')
            }
            if (!(helper._getOutputID(record) in this.nodes)) {
                this.nodes[helper._getOutputID(record)] = this._createOutputNode(record);
                debug("output node done")
            }
            if (!(helper._createUniqueEdgeID(record) in this.edges)) {
                this.edges[helper._createUniqueEdgeID(record)] = this._createEdge(record);
            }
            // this.nodes = { ...this.nodes, ...this._createInputNode(record) };
            // this.nodes = { ...this.nodes, ...this._createOutputNode(record) };
            // this.edges = { ...this.edges, ...this._createEdge(record) };

        })
        this.kg = {
            nodes: this.nodes,
            edges: this.edges
        }
    }
}