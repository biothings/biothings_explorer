export interface TrapiQNode {
  ids?: string[];
  categories?: string[];
  is_set?: boolean;
  constraints?: TrapiAttributeConstraint[];
}

export interface TrapiQEdge {
  knowledge_type?: string;
  predicates?: string[];
  subject: string;
  object: string;
  attribute_constraints?: TrapiAttributeConstraint[];
  qualifier_constraints?: TrapiQualifierConstraint[];
}

export interface TrapiQueryGraph {
  nodes: {
    [QNodeID: string]: TrapiQNode;
  };
  edges: {
    [QEdgeID: string]: TrapiQEdge;
  };
}

export interface TrapiSource {
  resource_id: string;
  resource_role: string;
  upstream_resource_ids?: string[];
  source_record_urls?: string[];
}

export interface TrapiKGNodes {
  [nodeID: string]: TrapiKGNode;
}

export interface TrapiKGEdges {
  [edgeID: string]: TrapiKGEdge;
}

export interface TrapiKnowledgeGraph {
  nodes: TrapiKGNodes;
  edges: TrapiKGEdges;
}

export interface TrapiKGEdge {
  predicate: string;
  subject: string;
  object: string;
  attributes?: TrapiAttribute[];
  qualifiers?: TrapiQualifier[];
  sources: TrapiSource[];
}

export interface TrapiKGNode {
  categories: string[];
  name: string;
  attributes?: TrapiAttribute[];
}

export interface TrapiAttribute {
  attribute_type_id: string;
  original_attribute_name?: string;
  value: string | string[] | number | number[];
  value_type_id?: string;
  attribute_source?: string | null;
  value_url?: string | null;
  attributes?: TrapiAttribute;
  [additionalProperties: string]:
  | string
  | string[]
  | null
  | TrapiAttribute
  | number
  | number[];
}

export interface TrapiQualifier {
  qualifier_type_id: string;
  qualifier_value: string | string[];
}

export interface TrapiQualifierConstraint {
  qualifier_set: TrapiQualifier[];
}

export interface TrapiAttributeConstraint {
  id: string;
  name: string;
  not: boolean;
  operator: string;
  value: string | string[] | number | number[];
}

export interface TrapiNodeBinding {
  id: string;
  query_id?: string;
  attributes?: TrapiAttribute[];
}

export interface TrapiEdgeBinding {
  id: string;
  attributes?: TrapiAttribute[];
}

export interface TrapiAnalysis {
  resource_id?: string;
  score?: number;
  edge_bindings: {
    [qEdgeID: string]: TrapiEdgeBinding[];
  };
  support_graphs?: string[];
  scoring_method?: string;
  attributes?: TrapiAttribute[];
}

export interface TrapiAuxiliaryGraph {
  edges: string[];
  attributes?: TrapiAttribute[];
}

export interface TrapiPfocrFigure {
  figureUrl: string;
  pmc: string;
  matchedCuries: string[];
  score: number;
}

export interface TrapiResult {
  node_bindings: {
    [qNodeID: string]: TrapiNodeBinding[];
  };
  analyses: TrapiAnalysis[];
  pfocr?: TrapiPfocrFigure[];
}

export interface TrapiAuxGraphCollection {
  [supportGraphID: string]: TrapiAuxiliaryGraph;
}

export interface TrapiLog {
  timestamp: string;
  level: string;
  message: string;
  code: string;
}

export interface TrapiWorkflow {
  id: string;
}

export interface TrapiQueryMessage {
  query_graph: TrapiQueryGraph;
}

export interface TrapiResponseMessage {
  query_graph: TrapiQueryGraph;
  knowledge_graph: TrapiKnowledgeGraph;
  auxiliary_graphs?: TrapiAuxGraphCollection;
  results: TrapiResult[];
}

export interface TrapiQuery {
  message: TrapiQueryMessage;
  log_level?: string;
  workflow?: TrapiWorkflow[];
  submitter?: string;
  callback?: string;
}

export interface TrapiResponse {
  status?: string;
  description?: string;
  schema_version?: string;
  biolink_version?: string;
  workflow?: TrapiWorkflow[];
  message: TrapiResponseMessage;
  logs: TrapiLog[];
  trace?: string; // Only used in dev
}

export interface TrapiAsyncStatusResponse {
  status: string;
  description: string;
  logs: TrapiLog[];
  response_url?: string;
}

export interface TrapiSchema {
  info: { version: string };
}
