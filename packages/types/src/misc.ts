import { SRIBioEntity } from "biomedical_id_resolver";

export type APIDefinition = {
  // Must have one of id or infores
  id?: string; // SmartAPI ID, takes priority over infores
  name: string; // Must match name on SmartAPI registry
  infores?: string; // infores of API
  primarySource?: boolean;
  timeout?: number;
} & ({ id: string } | { infores: string });

export interface APIList {
  include: APIDefinition[];
  // takes priority over include, taking into account id/infores prioritization
  exclude: APIDefinition[];
}

export interface UnavailableAPITracker {
  [server: string]: { skip: boolean; skippedQueries: number };
}

export interface SRIResolvedSet {
  [originalCurie: string]: SRIBioEntity;
}

export interface ExpandedCuries {
  [originalCurie: string]: string[];
}

export type SerializableObject<T> = T extends string | number | boolean | null
  ? T
  : T extends Function
  ? never
  : T extends object
  ? { [K in keyof T]: SerializableObject<T[K]> }
  : never;