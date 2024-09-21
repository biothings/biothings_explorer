import { SRIBioEntity } from "biomedical_id_resolver";
import { KGAssociationObject } from "@biothings-explorer/smartapi-kg";
import { TrapiSource } from "./index";
import crypto from "crypto";
import _ from "lodash";

function hash(string: string) {
  return crypto.createHash("md5").update(string).digest("hex");
}

export class RecordNode {
  original: string;
  normalizedInfo: SRIBioEntity;
  _qNode: QNode;
  _apiLabel: string;

  constructor(
    node: FrozenNode | VerboseFrozenNode | MinimalFrozenNode,
    qNode: QNode,
  ) {
    this.original = node.original;
    this.normalizedInfo = node.normalizedInfo
      ? node.normalizedInfo
      : this.makeFakeInfo(node);
    this._qNode = qNode;
    this._apiLabel = node.apiLabel;
  }

  makeFakeInfo(
    node: FrozenNode | VerboseFrozenNode | MinimalFrozenNode,
  ): SRIBioEntity {
    return {
      primaryID: node.curie,
      equivalentIDs: node.equivalentCuries ?? [],
      label: node.label,
      labelAliases: node.names,
      primaryTypes: [node.semanticType],
      semanticTypes: node.semanticTypes ?? [],
      attributes: node.attributes ?? {},
    };
  }

  toJSON(): VerboseFrozenNode {
    return {
      original: this.original,
      normalizedInfo: this.normalizedInfo,
      qNodeID: this.qNodeID,
      isSet: this.isSet,
      curie: this.curie,
      UMLS: this.UMLS,
      semanticType: this.semanticType,
      semanticTypes: this.semanticTypes,
      label: this.label,
      apiLabel: this._apiLabel,
      equivalentCuries: this.equivalentCuries,
      names: this.names,
      attributes: this.attributes,
    };
  }

  freeze(): FrozenNode {
    const node = this.toJSON() as FrozenNode;
    delete node.normalizedInfo;
    delete node.equivalentCuries;
    delete node.names;
    return node;
  }

  freezeVerbose(): VerboseFrozenNode {
    return this.toJSON();
  }

  freezeMinimal(): MinimalFrozenNode {
    return {
      original: this.original,
      normalizedInfo: this.normalizedInfo,
      apiLabel: this._apiLabel,
    };
  }

  get qNodeID(): string {
    return this._qNode.getID();
  }

  get isSet(): boolean {
    return this._qNode.isSet();
  }

  get curie(): string {
    return this.normalizedInfo?.primaryID;
  }

  get UMLS(): string[] {
    return (
      this.normalizedInfo?.equivalentIDs.reduce(
        (arr: string[], curie: string) => {
          if (curie.includes("UMLS")) arr.push(curie.replace("UMLS:", ""));
          return arr;
        },
        [],
      ) ?? []
    );
  }

  get semanticType(): string[] {
    return (
      this.normalizedInfo?.primaryTypes.map(
        semanticType => `biolink:${semanticType}`,
      ) ?? []
    );
  }

  get semanticTypes(): string[] {
    return (
      this.normalizedInfo?.semanticTypes.map(
        semanticType => `biolink:${semanticType}`,
      ) ?? []
    );
  }

  get label(): string {
    if (this.normalizedInfo?.label === this.curie) return this._apiLabel;
    return this.normalizedInfo?.label ?? this._apiLabel;
  }

  get equivalentCuries(): string[] {
    return this.normalizedInfo?.equivalentIDs ?? [];
  }

  get names(): string[] {
    return this.normalizedInfo?.labelAliases ?? [];
  }

  get attributes(): any {
    return this.normalizedInfo?.attributes ?? {};
  }
}

export class Record {
  association: KGAssociationObject;
  qEdge: QEdge;
  config: any;
  subject: RecordNode;
  object: RecordNode;
  reverseToExecution: boolean;
  _qualifiers: BulkQualifiers;
  _mappedResponse: MappedResponse;

  constructor(
    record: FrozenRecord | VerboseFrozenRecord | MinimalFrozenRecord,
    config?: any,
    association?: KGAssociationObject,
    qEdge?: QEdge,
    reverse?: boolean,
  ) {
    this.association = association ? association : this.makeAssociation(record);
    this.qEdge = qEdge ? qEdge : this.makeFakeQEdge(record);
    this.config = config ? config : { EDGE_ATTRIBUTES_USED_IN_RECORD_HASH: [] };
    this.reverseToExecution = reverse || false;
    if (!this.reverseToExecution) {
      this.subject = new RecordNode(record.subject, this.qEdge.getInputNode());
      this.object = new RecordNode(record.object, this.qEdge.getOutputNode());
    } else {
      this.subject = new RecordNode(record.subject, this.qEdge.getOutputNode());
      this.object = new RecordNode(record.object, this.qEdge.getInputNode());
    }
    this._qualifiers = record.qualifiers || this.association.qualifiers;
    this._mappedResponse = record.mappedResponse ? record.mappedResponse : {};
    if (!this._mappedResponse.publications) {
      this._mappedResponse.publications = record.publications;
    }
  }

  reverse() {
    const frozen = { ...this.freezeVerbose() };
    const reversedAssociation: KGAssociationObject = { ...frozen.association };
    reversedAssociation.input_id = frozen.association.output_id;
    reversedAssociation.input_type = frozen.association.output_type;
    reversedAssociation.output_id = frozen.association.input_id;
    reversedAssociation.output_type = frozen.association.input_type;
    const predicate = this.qEdge.getReversedPredicate(
      frozen.association.predicate,
    );
    reversedAssociation.predicate = predicate;
    if (reversedAssociation.qualifiers) {
      const reversedQualifiers = Object.fromEntries(
        Object.entries(reversedAssociation.qualifiers).map(
          ([qualifierType, qualifier]) => {
            let newQualifierType: string = qualifierType;
            let newQualifier: string | string[] = qualifier;
            if (qualifierType.includes("predicate")) {
              if (Array.isArray(qualifier)) {
                newQualifier = qualifier.map(
                  (str: string) =>
                    `biolink:${this.qEdge.getReversedPredicate(
                      str.replace("biolink:", ""),
                    )}`,
                );
              } else {
                newQualifier = `biolink:${this.qEdge.getReversedPredicate(
                  qualifier.replace("biolink:", ""),
                )}`;
              }
            }
            if (qualifierType.includes("subject")) {
              newQualifierType = qualifierType.replace("subject", "object");
            }
            if (qualifierType.includes("object")) {
              newQualifierType = qualifierType.replace("object", "subject");
            }
            return [newQualifierType, newQualifier];
          },
        ),
      );

      reversedAssociation.qualifiers = reversedQualifiers;
      frozen.qualifiers = reversedQualifiers;
    }
    // frozen.predicate = 'biolink:' + predicate;
    frozen.association = reversedAssociation;
    const temp = frozen.subject;
    frozen.subject = frozen.object;
    frozen.object = temp;
    return new Record(
      frozen,
      this.config,
      frozen.association,
      this.qEdge,
      !this.reverseToExecution,
    );
  }

  queryDirection() {
    if (!this.qEdge.isReversed()) {
      return this;
    } else {
      return this.reverse();
    }
  }

  // for user-made records lacking qEdge
  makeFakeQEdge(
    record: FrozenRecord | VerboseFrozenRecord | MinimalFrozenRecord,
  ): QEdge {
    return {
      getID(): string {
        return "fakeEdge";
      },
      getInputNode(): QNode {
        return {
          getID(): string {
            return record.subject.qNodeID;
          },
          isSet(): boolean {
            return record.subject.isSet || false;
          },
        };
      },
      getOutputNode(): QNode {
        return {
          getID(): string {
            return record.object.qNodeID;
          },
          isSet(): boolean {
            return record.object.isSet || false;
          },
        };
      },
      isReversed(): boolean {
        return false;
      },
      // WARNING not useable alongside actual QEdge.getHashedEdgeRepresentation
      // However the two should never show up together as this is only for testing purposes
      getHashedEdgeRepresentation(): string {
        return hash(
          record.subject.semanticType +
            record.predicate +
            record.object.semanticType +
            (record.subject.equivalentCuries || record.object.equivalentCuries),
        );
      },
    };
  }

  makeAssociation(
    record: FrozenRecord | VerboseFrozenRecord | MinimalFrozenRecord,
  ): KGAssociationObject {
    return {
      input_type: record.subject.semanticType,
      output_type: record.object.semanticType,
      predicate: record.predicate?.replace("biolink:", ""),
      qualifiers: record.qualifiers
        ? Object.fromEntries(
            Object.entries(record.qualifiers).map(
              ([qualifierType, qualifier]: [string, string]) => {
                return [qualifierType.replace("biolink:", ""), qualifier];
              },
            ),
          )
        : undefined,
      api_name: record.api,
      source: record.metaEdgeSource,
      "x-translator": {
        infores: record.apiInforesCurie,
      },
      apiIsPrimaryKnowledgeSource: false,
    };
  }

  public static freezeRecords(records: Record[]): FrozenRecord[] {
    return records.map((record: Record): FrozenRecord => record.freeze());
  }

  public static unfreezeRecords(
    records: FrozenRecord[],
    config?: any,
  ): Record[] {
    return records.map(
      (record: FrozenRecord): Record => new Record(record, config),
    );
  }

  public static packRecords(records: Record[]): RecordPackage {
    // save string space by storing association and recordNode .normalizedInfo's separately (eliminates duplicates)
    const frozenRecords = [];
    const associationHashes = [];
    const associations = [];
    records.forEach((record: Record) => {
      const frozenRecord = record.freezeMinimal();

      const associationHash = hash(JSON.stringify(record.association));

      let associationHashIndex = associationHashes.findIndex(
        hash => hash === associationHash,
      );

      if (associationHashIndex === -1) {
        associationHashes.push(associationHash);
        associations.push(record.association);
        associationHashIndex = associationHashes.length - 1;
      }

      frozenRecords.push({
        ...frozenRecord,
        association: associationHashIndex,
      });
    });

    return [associations, ...frozenRecords];
  }

  public static unpackRecords(
    recordPack: RecordPackage,
    qEdge: QEdge,
    config?: any,
  ): Record[] {
    const [associations, ...frozenRecords] = recordPack;
    return frozenRecords.map((record: any): Record => {
      const association = associations[record.association];
      return new Record(record, config, association, qEdge);
    });
  }

  toJSON(): VerboseFrozenRecord {
    return {
      subject: this.subject.freezeVerbose(),
      object: this.object.freezeVerbose(),
      association: this.association,
      predicate: this.predicate,
      qualifiers: this.qualifiers,
      publications: this.publications,
      recordHash: this.recordHash,
      api: this.api,
      apiInforesCurie: this.apiInforesCurie,
      metaEdgeSource: this.metaEdgeSource,
      mappedResponse: this._mappedResponse,
    };
  }

  freeze(): FrozenRecord {
    const record = this.toJSON() as FrozenRecord;
    record.subject = this.subject.freeze();
    record.object = this.object.freeze();
    //@ts-ignore
    delete record.association;
    record.mappedResponse = {
      ...record.mappedResponse,
      publications: undefined,
    };
    return record;
  }

  freezeVerbose(): VerboseFrozenRecord {
    return this.toJSON();
  }

  freezeMinimal(): MinimalFrozenRecord {
    return {
      subject: this.subject.freezeMinimal(),
      object: this.object.freezeMinimal(),
      qualifiers: this.qualifiers,
      publications: this.publications,
      mappedResponse: this._mappedResponse,
    };
  }

  _getFlattenedEdgeAttributes(attributes: EdgeAttribute[]): EdgeAttribute[] {
    return attributes
      ? attributes.reduce((arr: EdgeAttribute[], attribute: EdgeAttribute) => {
          attribute.attributes
            ? arr.push(
                attribute,
                ...this._getFlattenedEdgeAttributes(attribute.attributes),
              )
            : arr.push(attribute);
          return arr;
        }, [])
      : [];
  }

  get mappedResponse() {
    return Object.fromEntries(
      Object.entries(this._mappedResponse).filter(([key, _val]) => {
        return key !== "source_url";
      }),
    );
  }

  get knowledge_level(): string | undefined {
    return this.association.knowledge_level;
  }

  get agent_type(): string | undefined {
    return this.association.agent_type;
  }

  get _configuredEdgeAttributesForHash(): string {
    return this._getFlattenedEdgeAttributes(
      this._mappedResponse["edge-attributes"],
    )
      .filter(attribute => {
        return this.config?.EDGE_ATTRIBUTES_USED_IN_RECORD_HASH?.includes(
          attribute.attribute_type_id,
        );
      })
      .reduce((acc, attribute) => {
        return [...acc, `${attribute.attribute_type_id}:${attribute.value}`];
      }, [])
      .join(",");
  }

  get _recordHashContent(): string {
    return [
      this.subject.curie,
      this.predicate,
      this.object.curie,
      Object.entries(this.qualifiers)
        .sort(([qTa, _qVa], [qTb, _qVb]) => qTa.localeCompare(qTb))
        .reduce(
          (str, [qualifierType, qualifierValue]) =>
            `${str};${qualifierType}:${JSON.stringify(qualifierValue)}`,
          "",
        ),
      this.api,
      this.metaEdgeSource,
      this._configuredEdgeAttributesForHash,
      JSON.stringify(
        this.provenanceChain.sort((sourceA, sourceB) =>
          sourceA.resource_id.localeCompare(sourceB.resource_id),
        ).map(source => _.omit(source, ["source_record_urls"])),
      ),
      this.knowledge_level,
      this.agent_type
    ].join("-");
  }

  get recordHash(): string {
    return hash(this._recordHashContent);
  }

  get predicate(): string {
    return "biolink:" + this.association.predicate;
  }

  get qualifiers(): BulkQualifiers {
    if (!this._qualifiers) {
      return {};
    }
    return Object.fromEntries(
      Object.entries(this._qualifiers).map(([qualifierType, qualifier]) => {
        const newQualifierType = `biolink:${qualifierType.replace(
          "biolink:",
          "",
        )}`;
        let newQualifier = qualifier;
        if (qualifierType.includes("predicate")) {
          if (Array.isArray(qualifier)) {
            newQualifier = qualifier.map(
              str => `biolink:${str.replace("biolink", "")}`,
            );
          } else {
            newQualifier = `biolink:${qualifier.replace("biolink:", "")}`;
          }
        }
        return [newQualifierType, newQualifier];
      }),
    );
  }

  get api(): string {
    return this.association.api_name;
  }

  get apiInforesCurie(): string {
    if (this.association["x-translator"]) {
      return this.association["x-translator"]["infores"] || "infores:error-not-provided";
    }
    return "infores:error-not-provided";
  }

  get metaEdgeSource(): string {
    return this.association.source;
  }

  get provenanceChain(): TrapiSource[] {
    const source_urls = this._mappedResponse.source_url ?? undefined;
    let returnValue: TrapiSource[] = [];
    if (this._mappedResponse.trapi_sources) {
      returnValue = _.cloneDeep(this._mappedResponse.trapi_sources);
    } else {
      returnValue.push({
        resource_id: this.association.apiIsPrimaryKnowledgeSource
          ? this.apiInforesCurie
          : this.metaEdgeSource,
        resource_role: "primary_knowledge_source",
        source_record_urls: source_urls,
      });
      if (!this.association.apiIsPrimaryKnowledgeSource) {
        returnValue.push({
          resource_id: this.apiInforesCurie,
          resource_role: "aggregator_knowledge_source",
          upstream_resource_ids: [this.metaEdgeSource],
        });
      }
    }
    returnValue.push({
      resource_id: this.config.provenanceUsesServiceProvider
        ? "infores:service-provider-trapi"
        : "infores:biothings-explorer",
      resource_role: "aggregator_knowledge_source",
      upstream_resource_ids: [this.apiInforesCurie],
    });
    return returnValue;
  }

  get publications(): string[] {
    return this._mappedResponse.publications || [];
  }
}

export interface FrozenRecord {
  subject: FrozenNode;
  object: FrozenNode;
  predicate?: string; // not required if given association, qEdge
  qualifiers?: BulkQualifiers;
  publications?: string[]; // not required if given association, qEdge
  recordHash?: string; // always supplied by Record, not required from user
  api?: string; // not required if given association, qEdge
  apiInforesCurie?: string; // not required if given association, qEdge
  metaEdgeSource?: string; // not required if given association, qEdge
  mappedResponse?: MappedResponse;
}

export interface VerboseFrozenRecord {
  subject: VerboseFrozenNode;
  object: VerboseFrozenNode;
  association: KGAssociationObject;
  predicate?: string; // not required if given association, qEdge
  qualifiers: BulkQualifiers;
  publications?: string[]; // not required if given association, qEdge
  recordHash?: string; // always supplied by Record, not required from user
  api?: string; // not required if given association, qEdge
  apiInforesCurie?: string; // not required if given association, qEdge
  metaEdgeSource?: string; // not required if given association, qEdge
  mappedResponse?: MappedResponse;
}

// removes all computed values on assumption that association and qEdge are saved elsewhere
export interface MinimalFrozenRecord {
  subject: VerboseFrozenNode | MinimalFrozenNode;
  object: VerboseFrozenNode | MinimalFrozenNode;
  publications?: string[]; // not always present
  mappedResponse?: MappedResponse;
  [additionalProperties: string]: any;
}

export interface FrozenNode {
  // less verbose, loses extra information from nodeNormalizer
  original: string;
  qNodeID: string;
  isSet: boolean;
  curie: string;
  UMLS: string[];
  semanticType: string[];
  label: string;
  apiLabel?: string;
  attributes: any;
  [additionalProperties: string]: any; // cleanest way to handler undefined properties
}

export interface VerboseFrozenNode {
  original: string;
  normalizedInfo?: SRIBioEntity; // always supplied by Record, not required from user
  qNodeID: string;
  isSet: boolean;
  curie: string;
  UMLS: string[];
  semanticType: string[];
  semanticTypes: string[];
  label: string;
  apiLabel?: string;
  equivalentCuries?: string[]; // always supplied by Record, not required from user
  names: string[];
  attributes: any;
}

export interface MinimalFrozenNode {
  original: string;
  normalizedInfo?: SRIBioEntity; // always supplied by Record, not required from user
  apiLabel?: string;
  [additionalProperties: string]: any; // cleanest way to handler undefined properties
}

export type RecordPackage = [
  associations: any[],
  ...frozenRecords: FrozenRecord[],
];

export interface MappedResponse {
  trapi_sources?: TrapiSource[];
  "edge-attributes"?: EdgeAttribute[];
  [mappedItems: string]: any;
}

export interface QEdge {
  getInputNode(): QNode;
  getOutputNode(): QNode;
  getHashedEdgeRepresentation(): string;
  isReversed(): boolean;
  [additionalProperties: string]: any;
}

export interface QNode {
  getID(): string;
  isSet(): boolean;
  [additionalProperties: string]: any;
}

export interface EdgeAttribute {
  attribute_source: string;
  attribute_type_id: string;
  value: any;
  value_type_id: string;
  attributes?: EdgeAttribute[];
  [additionalProperties: string]: any;
}

export interface Identifier {
  identifier: string;
  label?: string;
}

export interface BulkQualifiers {
  [qualifierTypeID: string]: string | string[]; // qualifierValue
}
