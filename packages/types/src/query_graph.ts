import QEdge from "./query_edge";
import {
  InvalidQueryGraphError,
  TrapiQueryGraph,
} from "./index";
import { LogEntry, StampedLog, biolink } from "@biothings-explorer/utils";
import Debug from "debug";
import QNode from "./query_node";
import { resolveSRI } from "biomedical_id_resolver";
import _ from "lodash";
import * as utils from "@biothings-explorer/utils";

const debug = Debug("bte:query_graph");

export default class QueryGraph {
  queryGraph: TrapiQueryGraph;
  schema: any;
  logs: StampedLog[];
  nodes: { [QNodeID: string]: QNode };
  edges: { [QEdgeID: string]: QEdge };
  constructor(queryGraph: TrapiQueryGraph, schema: any) {
    this.queryGraph = queryGraph;
    this.schema = schema;
    this.logs = [];
  }

  _validateEmptyNodes(queryGraph: TrapiQueryGraph): void {
    if (Object.keys(queryGraph.nodes).length === 0) {
      throw new InvalidQueryGraphError(
        "Your Query Graph has no nodes defined.",
      );
    }
  }

  _validateOneNodeID(queryGraph: TrapiQueryGraph): void {
    for (const nodeID in queryGraph.nodes) {
      if (
        queryGraph.nodes[nodeID] &&
        queryGraph.nodes[nodeID]?.ids?.length > 0
      ) {
        return;
      }
    }
    throw new InvalidQueryGraphError(
      "body/message.query_graph.nodes should contain at least one node with at least one non-null id",
    );
  }

  _validateEmptyEdges(queryGraph: TrapiQueryGraph): void {
    if (Object.keys(queryGraph.edges).length === 0) {
      throw new InvalidQueryGraphError(
        "Your Query Graph has no edges defined.",
      );
    }
  }

  _validateNodeEdgeCorrespondence(queryGraph: TrapiQueryGraph): void {
    for (const qEdgeID in queryGraph.edges) {
      if (!(this.queryGraph.edges[qEdgeID].subject in queryGraph.nodes)) {
        throw new InvalidQueryGraphError(
          `The subject of edge ${qEdgeID} is not defined in the query graph.`,
        );
      }
      if (!(this.queryGraph.edges[qEdgeID].object in queryGraph.nodes)) {
        throw new InvalidQueryGraphError(
          `The object of edge ${qEdgeID} is not defined in the query graph.`,
        );
      }
    }
  }

  _validateBatchSize(queryGraph: TrapiQueryGraph): void {
    Object.entries(queryGraph.nodes).forEach(([nodeID, node]) => {
      if (node.ids && node.ids.length > 150) {
        throw new InvalidQueryGraphError(
          `Query node ${nodeID} exceeds batch size limit.`,
        );
      }
    });
  }

  _validateDuplicateEdges(queryGraph: TrapiQueryGraph): void {
    const edgeSet = new Set();
    for (const edgeID in queryGraph.edges) {
      const subject = queryGraph.edges[edgeID].subject;
      const object = queryGraph.edges[edgeID].object;
      if (
        edgeSet.has(`${subject}-${object}`) ||
        edgeSet.has(`${object}-${subject}`)
      ) {
        throw new InvalidQueryGraphError("Multiple edges between two nodes.");
      }
      edgeSet.add(`${subject}-${object}`);
    }
  }

  _validateCycles(queryGraph: TrapiQueryGraph): void {
    const nodes = {};
    for (const nodeID in queryGraph.nodes) {
      nodes[nodeID] = {
        connections: new Set(),
        visited: false,
      };
    }

    for (const edgeID in queryGraph.edges) {
      const edge = queryGraph.edges[edgeID];
      nodes[edge.subject].connections.add(edge.object);
      nodes[edge.object].connections.add(edge.subject);
    }

    for (const firstNode in nodes) {
      if (nodes[firstNode].visited === true) continue;
      const stack: { curNode: string; parent: string | number }[] = [
        { curNode: firstNode, parent: -1 },
      ];
      nodes[firstNode].visited = true;
      while (stack.length !== 0) {
        const { curNode, parent } = stack.pop();
        for (const conNode of nodes[curNode].connections) {
          if (conNode == parent) continue;
          if (nodes[conNode].visited === true) {
            throw new InvalidQueryGraphError(
              "The query graph contains a cycle.",
            );
          }
          stack.push({ curNode: conNode, parent: curNode });
          nodes[conNode].visited = true;
        }
      }
    }
  }

  _validateNodeProperties(queryGraph: TrapiQueryGraph): void {
    const schemProps = this.schema?.components?.schemas?.QNode?.properties
      ? this.schema.components.schemas.QNode.properties
      : {};
    const nodeProperties = new Set(Object.keys(schemProps));
    const badProperties = new Set();
    const badNodes = new Set();
    for (const nodeID in queryGraph.nodes) {
      for (const property in queryGraph.nodes[nodeID]) {
        if (!nodeProperties.has(property)) {
          badProperties.add(property);
          badNodes.add(nodeID);
        }
      }
    }

    if (badProperties.size !== 0) {
      this.logs.push(
        new LogEntry(
          "WARNING",
          null,
          `Ignoring unrecognized properties (${[...badProperties].join(
            ",",
          )}) on nodes (${[...badNodes].join(",")}).`,
        ).getLog(),
      );
    }
  }

  _validateEdgeProperties(queryGraph: TrapiQueryGraph): void {
    const schemProps = this.schema?.components?.schemas?.QEdge?.properties
      ? this.schema.components.schemas.QEdge.properties
      : {};
    const edgeProperties = new Set(Object.keys(schemProps));
    const badProperties = new Set();
    const badEdges = new Set();
    for (const edgeID in queryGraph.edges) {
      for (const property in queryGraph.edges[edgeID]) {
        if (!edgeProperties.has(property)) {
          badProperties.add(property);
          badEdges.add(edgeID);
        }
      }
    }

    if (badProperties.size !== 0) {
      this.logs.push(
        new LogEntry(
          "WARNING",
          null,
          `Ignoring unrecognized properties (${[...badProperties].join(
            ",",
          )}) on edges (${[...badEdges].join(",")}).`,
        ).getLog(),
      );
    }
  }

  _validateNoDuplicateQualifierTypes(queryGraph: TrapiQueryGraph): void {
    Object.entries(queryGraph.edges).forEach(([id, edge]) => {
      if (edge.qualifier_constraints) {
        edge.qualifier_constraints.forEach((qualifierSet, i) => {
          const qualifierTypes = new Set();
          qualifierSet.qualifier_set.forEach(({ qualifier_type_id }) => {
            if (qualifierTypes.has(qualifier_type_id)) {
              throw new InvalidQueryGraphError(
                `Query edge ${id} qualifier set ${i} contains duplicate qualifier_type_id ${qualifier_type_id}`,
              );
            }
            qualifierTypes.add(qualifier_type_id);
          });
        });
      }
    });
  }

  _validate(queryGraph: TrapiQueryGraph): void {
    this._validateEmptyEdges(queryGraph);
    this._validateEmptyNodes(queryGraph);
    this._validateOneNodeID(queryGraph);
    this._validateNodeEdgeCorrespondence(queryGraph);
    this._validateDuplicateEdges(queryGraph);
    this._validateNodeProperties(queryGraph);
    this._validateEdgeProperties(queryGraph);
    this._validateBatchSize(queryGraph);
    this._validateCycles(queryGraph);
    this._validateNoDuplicateQualifierTypes(queryGraph);
  }

  private async _findNodeCategories(curies: string[]): Promise<string[]> {
    const noMatchMessage = `No category match found for ${JSON.stringify(
      curies,
    )}.`;
    if (curies.length == 1) {
      let matchedCategories: string[];
      const resolved = await resolveSRI({
        unknown: curies,
      });
      debug(`Query node missing categories...Looking for match...`);
      if (resolved[curies[0]] && resolved[curies[0]].primaryTypes) {
        matchedCategories = resolved[curies[0]].primaryTypes;
        return matchedCategories.filter(c => c).map(c => `biolink:${c}`);
      } else {
        debug(noMatchMessage);
        this.logs.push(new LogEntry("ERROR", null, noMatchMessage).getLog());
        return [];
      }
    } else {
      try {
        let finalCategories: string[] = [];
        const tree = biolink.biolink.classTree.objects;

        // get array of all unique categories for all curies
        const allCategories = [
          ...Object.values(await resolveSRI({ unknown: curies }))
            .map(resolvedCurie => resolvedCurie.semanticTypes)
            .filter(semanticTypes => semanticTypes.some(item => item !== null))
            .map(semanticTypes =>
              semanticTypes.map(t => utils.removeBioLinkPrefix(t)),
            )
            .reduce(
              (set: Set<string>, arr: string[]): Set<string> =>
                new Set([...set, ...arr]),
              new Set(),
            ),
        ];

        if (allCategories.length) {
          finalCategories.push(allCategories[0]);
        } else {
          debug(noMatchMessage);
          this.logs.push(new LogEntry("ERROR", null, noMatchMessage).getLog());
          return [];
        }

        allCategories.forEach((category, i) => {
          const keepSet: Set<string> = new Set();
          const rmSet: Set<string> = new Set();
          // check against each currently selected category
          finalCategories.forEach(selected => {
            if (tree[selected].is_mixin) {
              rmSet.add(selected);
            }
            if (tree[category].is_mixin) {
              rmSet.add(category);
            }
            if (category === selected) {
              return keepSet.add(category);
            }

            let parent = category;
            while (parent) {
              if (
                selected === parent ||
                tree[selected].children.includes(parent)
              ) {
                rmSet.add(selected);
                return keepSet.add(category);
              }
              parent = tree[parent].parent;
            }

            parent = selected;
            while (parent) {
              if (
                category === parent ||
                tree[category].children.includes(parent)
              ) {
                rmSet.add(category);
                return keepSet.add(selected);
              }
              parent = tree[parent].parent;
            }
            // add both if neither is ancestor of the other
            keepSet.add(category).add(selected);
          });
          finalCategories = [...keepSet].filter(cat => !rmSet.has(cat));
          // in event no categories are kept (due to mixin shenanigans/etc)
          if (!finalCategories.length && i < allCategories.length - 1) {
            finalCategories = [allCategories[i + 1]];
          }
        });
        if (!finalCategories.length) {
          debug(noMatchMessage);
          this.logs.push(new LogEntry("ERROR", null, noMatchMessage).getLog());
        }
        return [...finalCategories].map(cat => "biolink:" + cat);
      } catch (error) {
        const errorMessage = `Unable to retrieve categories due to error ${error}`;
        debug(errorMessage);
        this.logs.push(new LogEntry("ERROR", null, errorMessage).getLog());
        return [];
      }
    }
  }

  private async _storeNodes(): Promise<{ [qNodeID: string]: QNode }> {
    const nodes: { [qNodeID: string]: QNode } = {};
    for (const qNodeID in this.queryGraph.nodes) {
      //if node has ID but no categories
      if (
        (!this.queryGraph.nodes[qNodeID].categories &&
          this.queryGraph.nodes[qNodeID].ids) ||
        (this.queryGraph.nodes[qNodeID].categories &&
          // this.queryGraph.nodes[qNodeID].categories.length == 0 &&
          this.queryGraph.nodes[qNodeID].ids)
      ) {
        let userAssignedCategories = this.queryGraph.nodes[qNodeID].categories;
        let categories = await this._findNodeCategories(
          this.queryGraph.nodes[qNodeID].ids,
        );
        if (userAssignedCategories) {
          userAssignedCategories = [...userAssignedCategories]; // new Array for accurate logging after node updated
          categories = categories.filter(
            category => !userAssignedCategories.includes(category),
          );
        }
        if (categories.length) {
          if (!this.queryGraph.nodes[qNodeID].categories) {
            this.queryGraph.nodes[qNodeID].categories = categories;
          } else {
            this.queryGraph.nodes[qNodeID].categories.push(...categories);
          }
          debug(
            `Node categories found. Assigning value: ${JSON.stringify(
              this.queryGraph.nodes[qNodeID],
            )}`,
          );
          this.logs.push(
            new LogEntry(
              "INFO",
              null,
              [
                `Node ${qNodeID} `,
                `with id${
                  this.queryGraph.nodes[qNodeID].ids.length > 1 ? "s" : ""
                } `,
                `[${this.queryGraph.nodes[qNodeID].ids.join(", ")}] `,
                `${
                  userAssignedCategories && userAssignedCategories.length
                    ? `and categor${
                        userAssignedCategories.length === 1 ? "y" : "ies"
                      } [${userAssignedCategories.join(", ")}] augmented with`
                    : `assigned`
                } `,
                `categor${categories.length > 1 ? "ies" : "y"} `,
                `[${categories.join(", ")}] inferred from `,
                `id${
                  this.queryGraph.nodes[qNodeID].ids.length > 1 ? "s" : ""
                }.`,
              ].join(""),
            ).getLog(),
          );
        }
        nodes[qNodeID] = new QNode({
          id: qNodeID,
          ...this.queryGraph.nodes[qNodeID],
        });
      } else {
        debug(`Creating node...`);
        nodes[qNodeID] = new QNode({
          id: qNodeID,
          ...this.queryGraph.nodes[qNodeID],
        });
      }

      if (nodes[qNodeID].categories !== undefined) {
        if (
          nodes[qNodeID].categories.includes("biolink:Disease") ||
          nodes[qNodeID].categories.includes("biolink:PhenotypicFeature")
        ) {
          nodes[qNodeID].categories = nodes[qNodeID].categories.filter(
            e => e !== "biolink:Disease" && e !== "biolink:PhenotypicFeature",
          );
          nodes[qNodeID].categories.push("biolink:DiseaseOrPhenotypicFeature");
        }
        if (
          nodes[qNodeID].categories.includes("biolink:Protein") &&
          !nodes[qNodeID].categories.includes("biolink:Gene")
        ) {
          nodes[qNodeID].categories.push("biolink:Gene");
        }
      }
    }
    this.logs.push(
      new LogEntry(
        "DEBUG",
        null,
        `BTE identified ${
          Object.keys(nodes).length
        } qNodes from your query graph`,
      ).getLog(),
    );
    return nodes;
  }

  async calculateEdges(): Promise<QEdge[]> {
    this._validate(this.queryGraph);
    //populate edge and node info
    debug(`(1) Creating edges for manager...`);
    if (this.nodes === undefined) {
      this.nodes = await this._storeNodes();
    }

    const edges = {};
    Object.entries(this.queryGraph.edges).forEach(([qEdgeID, qEdge]) => {
      const edge_info = {
        ...qEdge,
        ...{
          subject: this.nodes[qEdge.subject],
          object: this.nodes[qEdge.object],
        },
      };

      //store in each node ids of edges connected to them
      this.nodes[qEdge.subject].updateConnection(qEdgeID);
      this.nodes[qEdge.object].updateConnection(qEdgeID);

      edges[qEdgeID] = new QEdge({ id: qEdgeID, ...edge_info });
    });
    this.edges = edges;
    this.logs.push(
      new LogEntry(
        "DEBUG",
        null,
        `BTE identified ${
          Object.keys(this.edges).length
        } qEdges from your query graph`,
      ).getLog(),
    );
    return Object.values(this.edges);
  }
}
