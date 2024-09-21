import { TrapiAttribute, TrapiSource } from "./index";

export interface KGEdgeInfo {
  object: string;
  subject: string;
  predicate: string;
}

export default class KGEdge {
  id: string;
  predicate: string;
  subject: string;
  object: string;
  apis: Set<string>;
  inforesCuries: Set<string>;
  sources: {
    [resource_id: string]: {
      [resource_role: string]: {
        resource_id: string;
        resource_role: string;
        upstream_resource_ids?: Set<string>;
        source_record_urls?: Set<string>;
      };
    };
  };
  publications: Set<string>;
  qualifiers: {
    [qualifier_type_id: string]: string | string[];
  };
  attributes: {
    [attribute_type_id: string]: Set<string> | TrapiAttribute[];
    "edge-attributes"?: TrapiAttribute[];
  };
  constructor(id: string, info: KGEdgeInfo) {
    this.id = id;
    this.predicate = info.predicate;
    this.subject = info.subject;
    this.object = info.object;
    this.apis = new Set();
    this.inforesCuries = new Set();
    this.sources = {};
    this.publications = new Set();
    this.qualifiers = {};
    this.attributes = {};
  }

  addAPI(api: string | string[]): void {
    if (typeof api === "undefined") {
      return;
    }
    if (!Array.isArray(api)) {
      api = [api];
    }
    api.map(item => {
      this.apis.add(item);
    });
  }

  addInforesCurie(inforesCurie: string | string[]): void {
    if (typeof inforesCurie === "undefined") {
      return;
    }
    if (!Array.isArray(inforesCurie)) {
      inforesCurie = [inforesCurie];
    }
    inforesCurie.map(item => {
      this.inforesCuries.add(item);
    });
  }

  addSource(source: TrapiSource | TrapiSource[]): void {
    if (typeof source === "undefined") {
      return;
    }
    if (!Array.isArray(source)) {
      source = [source];
    }
    source.forEach(item => {
      if (!this.sources[item.resource_id]) this.sources[item.resource_id] = {};
      if (
        item.upstream_resource_ids &&
        !Array.isArray(item.upstream_resource_ids)
      ) {
        item.upstream_resource_ids = [item.upstream_resource_ids];
      }
      if (item.source_record_urls && !Array.isArray(item.source_record_urls)) {
        item.source_record_urls = [item.source_record_urls];
      }
      if (!this.sources[item.resource_id][item.resource_role]) {
        this.sources[item.resource_id][item.resource_role] = {
          resource_id: item.resource_id,
          resource_role: item.resource_role,
          upstream_resource_ids: item.upstream_resource_ids
            ? new Set(item.upstream_resource_ids)
            : undefined,
          source_record_urls: item.source_record_urls
            ? new Set(item.source_record_urls)
            : undefined,
        };
      }
      item.upstream_resource_ids?.forEach(upstream =>
        this.sources[item.resource_id][
          item.resource_role
        ].upstream_resource_ids.add(upstream),
      );
      item.source_record_urls?.forEach(url =>
        this.sources[item.resource_id][
          item.resource_role
        ].source_record_urls.add(url),
      );
    });
  }

  addPublication(publication: string | string[]): void {
    if (typeof publication === "undefined") {
      return;
    }
    if (!Array.isArray(publication)) {
      publication = [publication];
    }
    publication.map(item => {
      this.publications.add(item);
    });
  }

  addQualifier(name: string, value: string | string[]): void {
    this.qualifiers[name] = value;
  }

  addAdditionalAttributes(
    name: string,
    value: string | string[] | TrapiAttribute[],
  ): void {
    // special handling for full edge attributes
    if (name === "edge-attributes") {
      this.attributes[name] = value as TrapiAttribute[];
      return;
    }

    if (!(name in this.attributes)) {
      this.attributes[name] = new Set();
    }
    if (!Array.isArray(value)) {
      value = [value];
    }
    (value as string[]).map(item => {
      (this.attributes[name] as Set<string>).add(item);
    });
  }
}
