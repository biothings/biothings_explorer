import { SmartAPIKGOperationObject } from "@biothings-explorer/smartapi-kg";
import QEdge from "./query_edge";
import { SRIBioEntity } from "biomedical_id_resolver";

export interface MetaXEdge extends SmartAPIKGOperationObject {
  reasoner_edge: QEdge;
}

export interface TemplatedInput {
  queryInputs: string | string[];
  [additionalAttributes: string]: string | string[];
}

export interface APIEdge extends MetaXEdge {
  input: string | string[] | TemplatedInput;
  input_resolved_identifiers: {
    [curie: string]: SRIBioEntity;
  };
  original_input: {
    [equivalentCurie: string]: string;
  };
}

export interface NonBatchAPIEdge extends APIEdge {
  input: string;
}

export interface BatchAPIEdge extends APIEdge {
  input: string[];
}

export interface TemplateNonBatchAPIEdge extends APIEdge {
  input: TemplatedInput;
}

export interface TemplateBatchAPIEdge extends APIEdge {
  input: TemplatedInput;
}
