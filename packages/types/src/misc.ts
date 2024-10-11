export type APIDefinition = {
  // Must have one of id or infores
  id?: string; // SmartAPI ID, takes priority over infores
  name: string; // Must match name on SmartAPI registry
  infores?: string; // infores of API
  primarySource?: boolean;
  includeFlipped?: boolean; // Automatically generate flipped MetaEdges (TRAPI only)
  timeout?: number;
} & ({ id: string } | { infores: string });

export interface APIList {
  include: APIDefinition[];
  // takes priority over include, taking into account id/infores prioritization
  exclude: APIDefinition[];
}
