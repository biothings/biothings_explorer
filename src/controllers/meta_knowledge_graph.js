const meta_kg = require("@biothings-explorer/smartapi-kg");
const snakeCase = require("snake-case");
const fs = require("fs");
var path = require('path');
const util = require('util');
const PredicatesLoadingError = require("../utils/errors/predicates_error");
const ids = require("./ids");
const readFile = util.promisify(fs.readFile);

module.exports = class MetaKnowledgeGraphHandler {
    constructor(smartapiID = undefined, team = undefined) {
        this.smartapiID = smartapiID;
        this.team = team;
    }

    async _loadMetaKG(smartapiID = undefined, team = undefined) {
        const smartapi_specs = path.resolve(__dirname, '../../data/smartapi_specs.json');
        const predicates = path.resolve(__dirname, '../../data/predicates.json');
        const kg = new meta_kg.default(smartapi_specs, predicates);
        try {
            if (smartapiID !== undefined) {
                kg.constructMetaKGSync(false, { smartAPIID: smartapiID })
            } else if (team !== undefined) {
                kg.constructMetaKGSync(false, { teamName: team })
            } else {
                kg.constructMetaKGSync(true, {})
            }
            if (kg.ops.length === 0) {
                throw new PredicatesLoadingError("Failed to Load MetaKG");
            }
            return kg;
        } catch (error) {
            throw new PredicatesLoadingError("Failed to Load MetaKG");
        }

    }

    _modifyCategory(category) {
        if (category.startsWith("biolink:")) {
            return 'biolink:' + category.charAt(8).toUpperCase() + category.slice(9);
        } else {
            return "biolink:" + category.charAt(0).toUpperCase() + category.slice(1);
        }
    }

    _modifyPredicate(predicate) {
        if (predicate.startsWith("biolink:")) {
            return 'biolink:' + snakeCase.snakeCase(predicate.slice(8));
        } else {
            return "biolink:" + snakeCase.snakeCase(predicate);
        }
    }

    async getKG(smartapiID = this.smartapiID, team = this.team) {
        const kg = await this._loadMetaKG(smartapiID, team);
        let knowledge_graph = {
            nodes: {},
            edges: []
        };
        let predicates = {};
        Object.keys(ids).map(semanticType => {
            knowledge_graph.nodes[this._modifyCategory(semanticType)] = {
                id_prefixes: ids[semanticType].id_ranks
            }
        })
        kg.ops.map(op => {
            let input = this._modifyCategory(op.association.input_type);
            let output = this._modifyCategory(op.association.output_type);
            let pred = this._modifyPredicate(op.association.predicate);
            if (!(input in predicates)) {
                predicates[input] = {};
            }
            if (!(output in predicates[input])) {
                predicates[input][output] = [];
            }
            if (!(predicates[input][output].includes(pred))) {
                predicates[input][output].push(pred);
            }
        })
        Object.keys(predicates).map(input => {
            Object.keys(predicates[input]).map(output => {
                predicates[input][output].map(pred => {
                    knowledge_graph.edges.push({
                        subject: input,
                        predicate: pred,
                        object: output,
                        relation: null
                    })
                })
            })
        })
        return knowledge_graph;
    }
}