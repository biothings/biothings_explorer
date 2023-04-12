const meta_kg = require("@biothings-explorer/smartapi-kg");
const snakeCase = require("snake-case");
const fs = require("fs");
var path = require("path");
const util = require("util");
const PredicatesLoadingError = require("../utils/errors/predicates_error");
const readFile = util.promisify(fs.readFile);
const debug = require("debug")("bte:biothings-explorer-trapi:metakg");
const { API_LIST: apiList } = require("../config/apis");
const { supportedLookups } = require("@biothings-explorer/query_graph_handler");

module.exports = class MetaKnowledgeGraphHandler {
  constructor(smartAPIID = undefined, teamName = undefined) {
    this.smartAPIID = smartAPIID;
    this.teamName = teamName;
  }

  async _loadMetaKG(smartAPIID = undefined, teamName = undefined) {
    const smartapi_specs = path.resolve(__dirname, "../../data/smartapi_specs.json");
    const predicates = path.resolve(__dirname, "../../data/predicates.json");
    const kg = new meta_kg.default(smartapi_specs, predicates);
    try {
      if (smartAPIID !== undefined) {
        debug(`Constructing with SmartAPI ID ${smartAPIID}`);
        kg.constructMetaKGSync(false, { apiList, smartAPIID: smartAPIID });
      } else if (teamName !== undefined) {
        debug(`Constructing with team ${teamName}`);
        kg.constructMetaKGSync(false, { apiList, teamName: teamName });
      } else {
        debug(`Constructing with default`);
        kg.constructMetaKGSync(true, { apiList });
      }
      if (kg.ops.length === 0) {
        debug(`Found 0 operations`);
        throw new PredicatesLoadingError("Not Found - 0 operations");
      }
      return kg;
    } catch (error) {
      debug(`ERROR getting graph with ID:${smartAPIID} team:${teamName} because ${error}`);
      throw new PredicatesLoadingError(`Failed to Load MetaKG: ${error}`);
    }
  }

  _modifyCategory(category) {
    if (category.startsWith("biolink:")) {
      return "biolink:" + category.charAt(8).toUpperCase() + category.slice(9);
    } else {
      return "biolink:" + category.charAt(0).toUpperCase() + category.slice(1);
    }
  }

  _modifyPredicate(predicate) {
    if (predicate.startsWith("biolink:")) {
      return "biolink:" + snakeCase.snakeCase(predicate.slice(8));
    } else {
      return "biolink:" + snakeCase.snakeCase(predicate);
    }
  }

  _modifyQualifierData(type_id, value) {
    type_id = this._modifyPredicate(type_id);

    if (type_id.includes("predicate")) {
        if (!value.startsWith("biolink:")) {
            value = "biolink:" + value;
        }
    } else {
        if (value.startsWith("biolink:")) {
            value = value.slice(8);
        }
    }

    return [type_id, value];
  }

  async getKG(smartAPIID = this.smartAPIID, teamName = this.teamName) {
    const kg = await this._loadMetaKG(smartAPIID, teamName);
    let knowledge_graph = {
      nodes: {},
      edges: [],
    };
    let predicates = {};
    let node_sets = {};
    kg.ops.map(op => {
      let input = this._modifyCategory(op.association.input_type);
      let inputIDs = Array.isArray(op.association.input_id) ? op.association.input_id : [op.association.input_id];
      let output = this._modifyCategory(op.association.output_type);
      let outputIDs = Array.isArray(op.association.output_id) ? op.association.output_id : [op.association.output_id];
      let pred = this._modifyPredicate(op.association.predicate);
      let association_id = op.association.association_id ? this._modifyCategory(op.association.association_id) : undefined;
      let qualifiers = op.association.qualifiers;

      //edges
      if (!(input in predicates)) {
        predicates[input] = {};
      }
      if (!(output in predicates[input])) {
        predicates[input][output] = [];
      }
      if (predicates[input][output].every(obj => JSON.stringify(obj) !== JSON.stringify({predicate: pred, association: association_id, qualifiers}))) {
        predicates[input][output].push({predicate: pred, association: association_id, qualifiers});
      }

      //nodes
      if (!(input in node_sets)) {
        node_sets[input] = new Set();
      }
      inputIDs.forEach(id => id && node_sets[input].add(id));

      if (!(output in node_sets)) {
        node_sets[output] = new Set();
      }
      outputIDs.forEach(id => id && node_sets[output].add(id));
    });
    const edges = {};
    Object.keys(predicates).map(input => {
      Object.keys(predicates[input]).map(output => {
        predicates[input][output].map(pred => {
          const edge = {
            subject: input,
            predicate: pred.predicate,
            object: output,
            association: pred.association,
            qualifiers: pred.qualifiers ? Object.entries(pred.qualifiers).map(([qual, val]) => {
                const [type_id, value] = this._modifyQualifierData(qual, val);
                return { qualifier_type_id: type_id, applicable_values: [value] };
            }) : undefined,
            knowledge_types: ["lookup"],
          };
          knowledge_graph.edges.push(edge);
          if (edges[`${input}-${pred}-${output}`]) {
            edges[`${input}-${pred}-${output}`].push(edge);
          } else {
            edges[`${input}-${pred}-${output}`] = [edge];
          }
        });
      });
    });
    if (!smartAPIID && !teamName) {
      (await supportedLookups()).forEach(edge => {
        const {subject, predicate, object, qualifiers} = edge;
        if (Object.keys(edges).includes(edge)) {
          edges[`${subject}-${predicate}-${object}`].forEach(e => e.knowledge_types.push("inferred"));
        } else {
          knowledge_graph.edges.push({
            subject,
            predicate,
            object,
            qualifiers: qualifiers ? Object.entries(qualifiers).map(([qual, val]) => {
                const [type_id, value] = this._modifyQualifierData(qual, val);
                return { qualifier_type_id: type_id, applicable_values: [value] };
            }) : undefined,
            knowledge_types: ["inferred"],
          });
        }
      });
    }
    Object.keys(node_sets).map(node => {
      knowledge_graph.nodes[node] = { id_prefixes: Array.from(node_sets[node]) };
    });
    return knowledge_graph;
  }
};
