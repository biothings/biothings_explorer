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

  async findPath({startNode, endNode, minLength, maxLength, repeatedNodes}) {
    const kg = await this._loadMetaKG();
    console.log("params: ", startNode, endNode, minLength, maxLength, repeatedNodes);
    const ans = kg.findPath(startNode, endNode, minLength, maxLength, repeatedNodes);
    return {answer: ans};
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

      //edges
      if (!(input in predicates)) {
        predicates[input] = {};
      }
      if (!(output in predicates[input])) {
        predicates[input][output] = [];
      }
      if (!predicates[input][output].includes(pred)) {
        predicates[input][output].push(pred);
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
            predicate: pred,
            object: output,
            knowledge_types: ["lookup"],
          };
          knowledge_graph.edges.push(edge);
          edges[`${input}-${pred}-${output}`] = edge;
        });
      });
    });
    if (!smartAPIID && !teamName) {
      (await supportedLookups()).forEach(edge => {
        if (Object.keys(edges).includes(edge)) {
          edges[edge].knowledge_types.push("inferred");
        } else {
          let [subject, predicate, object] = edge.split("-");
          knowledge_graph.edges.push({
            subject,
            predicate,
            object,
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
