import Debug from 'debug';
import { LogEntry, StampedLog } from '@biothings-explorer/utils';
import KGNode from './kg_node';
import KGEdge from './kg_edge';
import { Record } from './record';
import { TrapiAuxiliaryGraph, TrapiResult } from './index';
import KnowledgeGraph from './knowledge_graph';
const debug = Debug('bte:Graph');

export interface BTEGraphUpdate {
  nodes: {
    [nodeID: string]: KGNode;
  };
  edges: {
    [edgeID: string]: KGEdge;
  };
}

export interface BTEGraphSubscriber {
  update: (kg: BTEGraphUpdate) => void;
}

export default class BTEGraph {
  nodes: {
    [nodeID: string]: KGNode;
  };
  edges: {
    [edgeID: string]: KGEdge;
  };
  subscribers: BTEGraphSubscriber[];
  constructor() {
    this.nodes = {};
    this.edges = {};
    this.subscribers = [];
  }

  update(queryRecords: Record[]): void {
    debug(`Updating BTE Graph now.`);
    const bteAttributes = ['name', 'label', 'id', 'api', 'provided_by', 'publications', 'trapi_sources'];
    queryRecords.map((record) => {
      if (record) {
        const inputPrimaryCurie = record.subject.curie;
        const inputQNodeID = record.subject.qNodeID;
        const inputBTENodeID = inputPrimaryCurie;
        // const inputBTENodeID = inputPrimaryCurie + '-' + inputQNodeID;
        const outputPrimaryCurie = record.object.curie;
        const outputQNodeID = record.object.qNodeID;
        // const outputBTENodeID = outputPrimaryCurie + '-' + outputQNodeID;
        const outputBTENodeID = outputPrimaryCurie;
        const recordHash = record.recordHash;

        if (!(outputBTENodeID in this.nodes)) {
          this.nodes[outputBTENodeID] = new KGNode(outputBTENodeID, {
            primaryCurie: outputPrimaryCurie,
            qNodeID: outputQNodeID,
            curies: record.object.equivalentCuries,
            names: record.object.names,
            label: record.object.label,
            semanticType: [record.object.semanticType[0]],
            nodeAttributes: record.object.attributes,
          });
        } else if (
          this.nodes[outputBTENodeID].label === undefined ||
          this.nodes[outputBTENodeID].label === this.nodes[outputBTENodeID].primaryCurie
        ) {
          this.nodes[outputBTENodeID].label = record.object.label;
        }

        if (!(inputBTENodeID in this.nodes)) {
          this.nodes[inputBTENodeID] = new KGNode(inputBTENodeID, {
            primaryCurie: inputPrimaryCurie,
            qNodeID: inputQNodeID,
            curies: record.subject.equivalentCuries,
            names: record.subject.names,
            label: record.subject.label,
            semanticType: [record.subject.semanticType[0]],
            nodeAttributes: record.subject.attributes,
          });
        } else if (
          this.nodes[inputBTENodeID].label === undefined ||
          this.nodes[inputBTENodeID].label === this.nodes[inputBTENodeID].primaryCurie
        ) {
          this.nodes[inputBTENodeID].label = record.subject.label;
        }

        this.nodes[outputBTENodeID].addSourceNode(inputBTENodeID);
        this.nodes[outputBTENodeID].addSourceQNodeID(inputQNodeID);
        this.nodes[inputBTENodeID].addTargetNode(outputBTENodeID);
        this.nodes[inputBTENodeID].addTargetQNodeID(outputQNodeID);
        if (!(recordHash in this.edges)) {
          this.edges[recordHash] = new KGEdge(recordHash, {
            predicate: record.predicate,
            subject: inputPrimaryCurie,
            object: outputPrimaryCurie,
          });
        }
        this.edges[recordHash].addAPI(record.api);
        this.edges[recordHash].addInforesCurie(record.apiInforesCurie);
        this.edges[recordHash].addPublication(record.publications);
        Object.keys(record._mappedResponse)
          .filter((k) => !(bteAttributes.includes(k) || k.startsWith('$')))
          .map((item) => {
            this.edges[recordHash].addAdditionalAttributes(item, record._mappedResponse[item]);
          });
        if (record.knowledge_level) {
          this.edges[recordHash].addAdditionalAttributes('biolink:knowledge_level', record.knowledge_level);
        }
        if (record.agent_type) {
          this.edges[recordHash].addAdditionalAttributes('biolink:agent_type', record.agent_type);
        }
        this.edges[recordHash].addSource(record.provenanceChain);
        Object.entries(record.qualifiers).forEach(([qualifierType, qualifier]) => {
          this.edges[recordHash].addQualifier(qualifierType, qualifier);
        });
      }
    });
  }

  prune(results: TrapiResult[], auxGraphs: { [auxGraphID: string]: TrapiAuxiliaryGraph }): void {
    debug('pruning BTEGraph nodes/edges...');
    const edgeBoundNodes: Set<string> = new Set();
    const resultsBoundEdges: Set<string> = new Set();

    // Handle nodes and edges bound to results directly
    results.forEach((result) => {
      Object.entries(result.analyses[0].edge_bindings).forEach(([, bindings]) => {
        bindings.forEach((binding) => resultsBoundEdges.add(binding.id));
      });
    });

    // Handle edges bound via auxiliary graphs
    // This will iterate over new edges as they're added
    resultsBoundEdges.forEach((edgeID) => {
      edgeBoundNodes.add(this.edges[edgeID].subject);
      edgeBoundNodes.add(this.edges[edgeID].object);
      const supportGraphs = [...(this.edges[edgeID].attributes['biolink:support_graphs'] ?? [])];
      supportGraphs.forEach((auxGraphID: string) => {
        auxGraphs[auxGraphID].edges.forEach((auxGraphEdgeID) => {
          edgeBoundNodes.add(this.edges[auxGraphEdgeID].subject);
          edgeBoundNodes.add(this.edges[auxGraphEdgeID].object);
          resultsBoundEdges.add(auxGraphEdgeID);
        });
      });
    });

    const nodesToDelete = Object.keys(this.nodes).filter((bteNodeID) => !edgeBoundNodes.has(bteNodeID));
    nodesToDelete.forEach((unusedBTENodeID) => delete this.nodes[unusedBTENodeID]);
    const edgesToDelete = Object.keys(this.edges).filter((recordHash) => !resultsBoundEdges.has(recordHash));
    edgesToDelete.forEach((unusedRecordHash) => delete this.edges[unusedRecordHash]);
    debug(`pruned ${nodesToDelete.length} nodes and ${edgesToDelete.length} edges from BTEGraph.`);
  }

  checkPrimaryKnowledgeSources(knowledgeGraph: KnowledgeGraph): StampedLog[] {
    const logs = [];
    Object.entries(knowledgeGraph.edges).map(([edgeID, edge]) => {
      const has_primary_knowledge_source = edge.sources.some(
        (source) => source.resource_role === 'primary_knowledge_source' && source.resource_id,
      );
      if (!has_primary_knowledge_source) {
        const logMsg = `Edge ${edgeID} (APIs: ${Array.from(this.edges[edgeID].apis).join(
          ', ',
        )}) is missing a primary knowledge source`;
        debug(logMsg);
        logs.push(new LogEntry('WARNING', null, logMsg).getLog());
      }
    });
    return logs;
  }

  /**
   * Register subscribers
   */
  subscribe(subscriber: BTEGraphSubscriber): void {
    this.subscribers.push(subscriber);
  }

  /**
   * Unsubscribe a listener
   */
  unsubscribe(subscriber: BTEGraphSubscriber): void {
    this.subscribers = this.subscribers.filter((fn) => {
      if (fn != subscriber) return fn;
    });
  }

  /**
   * Nofity all listeners
   */
  notify(): void {
    this.subscribers.map((subscriber) => {
      subscriber.update({
        nodes: this.nodes,
        edges: this.edges,
      });
    });
  }
}
