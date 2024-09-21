import { toArray } from "@biothings-explorer/utils";
import Debug from "debug";
import {
  TrapiAttribute,
  TrapiKnowledgeGraph,
  TrapiKGEdge,
  TrapiKGEdges,
  TrapiKGNode,
  TrapiKGNodes,
  TrapiQualifier,
  TrapiSource,
  APIDefinition,
} from "./index";
import KGNode from "./kg_node";
import KGEdge from "./kg_edge";
import { BTEGraphUpdate } from "./graph";
import { Telemetry } from '@biothings-explorer/utils';

const debug = Debug("bte:KnowledgeGraph");
const NON_ARRAY_ATTRIBUTES = [
  "biolink:knowledge_level",
  "biolink:agent_type",
  "biolink:evidence_count",
];

interface SpecialAttributeHandlers {
  [attribute_type_id: string]: (value: Set<string | number>, kgEdge: KGEdge) => TrapiAttribute['value'];
}

const SPECIAL_ATTRIBUTE_HANDLERS: SpecialAttributeHandlers = {
  'biolink:max_research_phase': (value, kgEdge) => {
    // Special handling for max research phase
    const phase_map = {
      '-1.0': 'not_provided',
      '0.5': 'pre_clinical_research_phase',
      '1.0': 'clinical_trial_phase_1',
      '2.0': 'clinical_trial_phase_2',
      '3.0': 'clinical_trial_phase_3',
      '4.0': 'clinical_trial_phase_4',
    };
    function map_phase(val: string) {
      let new_val = phase_map[val];
      if (typeof new_val !== 'undefined') return new_val;

      const source = Object.values(kgEdge.sources).find((src) => typeof src.primary_knowledge_source !== 'undefined')
        .primary_knowledge_source.resource_id;
      const err = new Error(
        `Unrecognized research phase (${val}) from ${source} ${kgEdge.subject} > ${kgEdge.predicate} > ${kgEdge.object}`,
      );
      Telemetry.captureException(err);
      return 'not_provided';
    }
    return Array.from(value as Set<string>).map(map_phase);
  },
};

export default class KnowledgeGraph {
  nodes: {
    [nodePrimaryID: string]: TrapiKGNode;
  };
  edges: {
    [edgeID: string]: TrapiKGEdge;
  };
  kg: TrapiKnowledgeGraph;
  apiList?: APIDefinition[];
  constructor(apiList?: APIDefinition[]) {
    this.nodes = {};
    this.edges = {};
    this.kg = {
      nodes: this.nodes,
      edges: this.edges,
    };
    this.apiList = apiList;
  }

  getNodes(): TrapiKGNodes {
    return this.nodes;
  }

  getEdges(): TrapiKGEdges {
    return this.edges;
  }

  _createNode(kgNode: KGNode): TrapiKGNode {
    const node = {
      categories: kgNode.semanticType,
      name: Array.isArray(kgNode.label) ? kgNode.label[0] : kgNode.label,
      attributes: [
        {
          attribute_type_id: "biolink:xref",
          value: kgNode.curies,
        },
        {
          attribute_type_id: "biolink:synonym",
          value: kgNode.names.length ? kgNode.names : toArray(kgNode.label),
        },
        // Currently unused
        // {
        //   attribute_type_id: 'num_source_nodes',
        //   value: kgNode._sourceNodes.size,
        //   //value_type_id: 'bts:num_source_nodes',
        // },
        // {
        //   attribute_type_id: 'num_target_nodes',
        //   value: kgNode._targetNodes.size,
        //   //value_type_id: 'bts:num_target_nodes',
        // },
        // {
        //   attribute_type_id: 'source_qg_nodes',
        //   value: Array.from(kgNode._sourceQNodeIDs),
        //   //value_type_id: 'bts:source_qg_nodes',
        // },
        // {
        //   attribute_type_id: 'target_qg_nodes',
        //   value: Array.from(kgNode._targetQNodeIDs),
        //   //value_type_id: 'bts:target_qg_nodes',
        // },
      ],
    };
    for (const key in kgNode.nodeAttributes) {
      node.attributes.push({
        attribute_type_id: key,
        value: kgNode.nodeAttributes[key] as string[],
        //value_type_id: 'bts:' + key,
      });
    }
    return node;
  }

  _createQualifiers(kgEdge: KGEdge): TrapiQualifier[] {
    const qualifiers = Object.entries(kgEdge.qualifiers || {}).map(
      ([qualifierType, qualifier]) => {
        return {
          qualifier_type_id: qualifierType,
          qualifier_value: qualifier,
        };
      },
    );

    return qualifiers.length ? qualifiers : undefined;
  }

  _createAttributes(kgEdge: KGEdge): TrapiAttribute[] {
    const attributes: TrapiAttribute[] = [];

    // publications
    if (Array.from(kgEdge.publications).length) {
      attributes.push({
        attribute_type_id: "biolink:publications",
        value: Array.from(kgEdge.publications),
        value_type_id: "linkml:Uriorcurie",
      });
    }

    Object.entries(kgEdge.attributes).forEach(([key, value]) => {
      if (key === "edge-attributes") return;
      
      let formatted_value: TrapiAttribute['value'] = NON_ARRAY_ATTRIBUTES.includes(key)
        ? Array.from(value as Set<string>).reduce((acc, val) => acc + val)
        : Array.from(value as Set<string>);

      if (key in SPECIAL_ATTRIBUTE_HANDLERS) {
        formatted_value = SPECIAL_ATTRIBUTE_HANDLERS[key](value as Set<string | number>, kgEdge);
      }

      attributes.push({
        attribute_type_id: key,
        // technically works for numbers as well
        value: formatted_value,
        //value_type_id: 'bts:' + key,
      });
    });

    //handle TRAPI APIs (Situation A of https://github.com/biothings/BioThings_Explorer_TRAPI/issues/208) and APIs that define 'edge-atributes' in x-bte
    kgEdge.attributes["edge-attributes"]?.forEach(attribute => {
      attributes.push(attribute);
    });
    return attributes;
  }

  _createSources(kgEdge: KGEdge): TrapiSource[] {
    const sources: TrapiSource[] = [];
    Object.entries(kgEdge.sources).forEach(([, roles]) => {
      Object.entries(roles).forEach(([, sourceObj]) => {
        const trapiSource: TrapiSource = {
          ...sourceObj,
          upstream_resource_ids: sourceObj.upstream_resource_ids
            ? [...sourceObj.upstream_resource_ids]
            : undefined,
          source_record_urls: sourceObj.source_record_urls
            ? [...sourceObj.source_record_urls]
            : undefined,
        };
        sources.push(trapiSource);
      });
    });
    return sources;
  }

  _createEdge(kgEdge: KGEdge): TrapiKGEdge {
    return {
      predicate: kgEdge.predicate,
      subject: kgEdge.subject,
      object: kgEdge.object,
      qualifiers: this._createQualifiers(kgEdge),
      attributes: this._createAttributes(kgEdge),
      sources: this._createSources(kgEdge),
    };
  }

  update(bteGraph: BTEGraphUpdate): void {
    Object.keys(bteGraph.nodes).map(node => {
      this.nodes[bteGraph.nodes[node].primaryCurie] = this._createNode(
        bteGraph.nodes[node],
      );
    });
    Object.keys(bteGraph.edges).map(edge => {
      this.edges[edge] = this._createEdge(bteGraph.edges[edge]);
    });
    this.kg = {
      nodes: this.nodes,
      edges: this.edges,
    };
  }
}
