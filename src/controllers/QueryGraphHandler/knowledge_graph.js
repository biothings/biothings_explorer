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
                category: "biolink:" + helper._getInputCategory(record),
                name: helper._getInputLabel(record),
                attributes: [
                    {
                        name: "equivalent_identifiers",
                        value: helper._getInputEquivalentIds(record)
                    }
                ]
            }
        }
    }

    _createOutputNode(record) {
        return {
            [helper._getOutputID(record)]: {
                category: "biolink:" + helper._getOutputCategory(record),
                name: helper._getOutputLabel(record),
                attributes: [
                    {
                        name: "equivalent_identifiers",
                        value: helper._getOutputEquivalentIds(record)
                    }
                ]
            }
        }
    }

    _createAttributes(record) {
        const bteAttributes = ["@type", "name", "pmc", "pubmed", "label", "id", "api", "provided_by"];
        let attributes = [
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
            [helper._createUniqueEdgeID(record)]: {
                predicate: "biolink:" + record["$association"].predicate,
                subject: helper._getInputID(record),
                object: helper._getOutputID(record),
                attributes: this._createAttributes(record)
            }
        }
    }

    update(queryResult) {
        queryResult.map(record => {
            this.nodes = { ...this.nodes, ...this._createInputNode(record) };
            this.nodes = { ...this.nodes, ...this._createOutputNode(record) };
            this.edges = { ...this.edges, ...this._createEdge(record) };

        })
        this.kg = {
            nodes: this.nodes,
            edges: this.edges
        }
    }
}