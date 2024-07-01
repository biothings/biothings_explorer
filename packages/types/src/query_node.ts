/* eslint-disable @typescript-eslint/no-var-requires */
import _ from "lodash";
import * as utils from "@biothings-explorer/utils";
import Debug from "debug";
import { ExpandedCuries, InvalidQueryGraphError, SRIResolvedSet } from "./index";
import { SRIBioEntity } from "biomedical_id_resolver";
const debug = Debug("bte:QNode");

export interface QNodeInfo {
  id: string;
  categories?: string[];
  ids?: string[];
  is_set?: boolean;
  expanded_curie?: ExpandedCuries;
  held_curie?: string[];
  held_expanded?: ExpandedCuries;
  constraints?: any;
  connected_to?: string[];
  equivalentIDs?: SRIResolvedSet;
}


export default class QNode {
  id: string;
  categories: string[];
  equivalentIDs?: SRIResolvedSet;
  expandedCategories: string[];
  equivalentIDsUpdated: boolean;
  curie: string[];
  is_set: boolean;
  expanded_curie: ExpandedCuries;
  entity_count: number;
  held_curie: string[];
  held_expanded: ExpandedCuries;
  constraints: any; // TODO type
  connected_to: Set<string>;

  constructor(info: QNodeInfo) {
    this.id = info.id;
    this.categories = info.categories || ["NamedThing"];
    this.expandedCategories = this.categories;
    this.equivalentIDsUpdated = false;
    // mainIDs
    this.curie = info.ids;
    //is_set
    this.is_set = info.is_set;
    //mainID : its equivalent ids
    this.expanded_curie =
      info.expanded_curie !== undefined ? info.expanded_curie : {};
    this.entity_count = info.ids ? info.ids.length : 0;
    debug(
      `(1) Node "${this.id}" has (${this.entity_count}) entities at start.`,
    );
    //when choosing a lower entity count a node with higher count
    // might be told to store its curies temporarily
    this.held_curie = info.held_curie !== undefined ? info.held_curie : [];
    this.held_expanded =
      info.held_expanded !== undefined ? info.held_expanded : {};
    //node constraints
    this.constraints = info.constraints;
    //list of edge ids that are connected to this node
    this.connected_to =
      info.connected_to !== undefined ? new Set(info.connected_to) : new Set();
    //object-ify array of initial curies
    if (info.expanded_curie === undefined) this.expandCurie();
    this.validateConstraints();
    this.expandCategories();
  }

  freeze(): QNodeInfo {
    return {
      categories: this.categories,
      connected_to: Array.from(this.connected_to),
      constraints: this.constraints,
      ids: this.curie,
      equivalentIDs: this.equivalentIDs,
      expanded_curie: this.expanded_curie,
      held_curie: this.held_curie,
      held_expanded: this.held_expanded,
      id: this.id,
      is_set: this.is_set,
    };
  }

  isSet(): boolean {
    //query node specified as set
    return this.is_set ? true : false;
  }

  validateConstraints(): void {
    const required = ["id", "operator", "value"];
    if (this.constraints && this.constraints.length) {
      this.constraints.forEach((constraint: unknown) => {
        const constraint_keys = Object.keys(constraint);
        if (_.intersection(constraint_keys, required).length < 3) {
          throw new InvalidQueryGraphError(
            `Invalid constraint specification must include (${required})`,
          );
        }
      });
    }
  }

  expandCurie(): void {
    if (this.curie && this.curie.length) {
      this.curie.forEach(id => {
        if (!Object.hasOwnProperty.call(id, this.expanded_curie)) {
          this.expanded_curie[id] = [id];
        }
      });
      debug(
        `(1) Node "${this.id}" expanded initial curie. ${JSON.stringify(
          this.expanded_curie,
        )}`,
      );
    }
  }

  updateConnection(qEdgeID: string): void {
    this.connected_to.add(qEdgeID);
    debug(`"${this.id}" connected to "${[...this.connected_to]}"`);
  }

  getConnections(): string[] {
    return [...this.connected_to];
  }

  holdCurie(): void {
    //hold curie aside temp
    debug(`(8) Node "${this.id}" holding ${JSON.stringify(this.curie)} aside.`);
    this.held_curie = this.curie;
    this.held_expanded = this.expanded_curie;
    this.curie = undefined;
    this.expanded_curie = {};
  }

  updateCuries(curies: ExpandedCuries): void {
    // {originalID : [aliases]}
    if (!this.curie) {
      this.curie = [];
    }
    //bring back held curie
    if (this.held_curie.length) {
      debug(`(8) Node "${this.id}" restored curie.`);
      //restore
      this.curie = this.held_curie;
      this.expanded_curie = this.held_expanded;
      //reset holds
      this.held_curie = [];
      this.held_expanded = {};
    }
    if (!this.curie.length) {
      debug(
        `Node "${this.id}" saving (${Object.keys(curies).length}) curies...`,
      );
      this.curie = Object.keys(curies);
      this.expanded_curie = curies;
    } else {
      debug(
        `Node "${this.id}" intersecting (${this.curie.length})/(${
          Object.keys(curies).length
        }) curies...`,
      );
      // let intersection = this.intersectCuries(this.curie, curies);
      // this.curie = intersection;
      // debug(`Node "${this.id}" kept (${intersection.length}) curies...`);
      this.intersectWithExpandedCuries(curies);
    }
    this.entity_count = this.curie.length;
  }

  _combineCuriesIntoList(curies: ExpandedCuries): string[] {
    // curies {originalID : ['aliasID']}
    //combine all curies into single list for easy intersection
    const combined: Set<string> = new Set();
    Object.values(curies).forEach(expanded => {
      if (!Array.isArray(expanded)) {
        combined.add(expanded);
      } else {
        expanded.forEach(curie => {
          combined.add(curie);
        });
      }
    });
    return [...combined];
  }

  intersectWithExpandedCuries(newCuries: ExpandedCuries): void {
    const keep: { [mainID: string]: string[] } = {};

    const existingSet = new Set();
    for (const key in this.expanded_curie) {
      for (const curie of this.expanded_curie[key]) {
        existingSet.add(curie.toLowerCase());
      }
    }

    // If a new entity has any alias intersection with an existing entity, keep it
    for (const [newMainID, currentAliases] of Object.entries(newCuries)) {
      let someIntersection = false;
      for (const curie of currentAliases) {
        if (existingSet.has(curie.toLowerCase())) {
          someIntersection = true;
          break;
        }
      }

      if (someIntersection) {
        if (!keep[newMainID]) keep[newMainID] = currentAliases;
      }
    }

    //save expanded curies (main + aliases)
    this.expanded_curie = keep;
    //save curies (main ids)
    this.curie = Object.keys(keep);
    debug(`Node "${this.id}" kept (${Object.keys(keep).length}) curies...`);
  }

  intersectCuries(curies: string[], newCuries: ExpandedCuries): string[] {
    //curies is a list ['ID']
    // new curies {originalID : ['aliasID']}
    const all_new_curies = this._combineCuriesIntoList(newCuries);
    return _.intersection(curies, all_new_curies);
  }

  getID(): string {
    return this.id;
  }

  getCurie(): string[] {
    return this.curie;
  }

  getEquivalentIDs(): SRIResolvedSet {
    return this.equivalentIDs ?? {};
  }

  removeEquivalentID(id: string): void {
    delete this.equivalentIDs[id];
  }

  getCategories(): string[] {
    if (this.equivalentIDsUpdated) this.expandCategories();
    return this.expandedCategories;
  }

  expandCategories(): void {
    this.equivalentIDsUpdated = false;
    if (this.hasEquivalentIDs() === false) {
      const categories = utils.toArray(this.categories);
      let expanded_categories = [];
      categories.map(category => {
        expanded_categories = [
          ...expanded_categories,
          ...(utils.biolink.getDescendantClasses(
            utils.removeBioLinkPrefix(category),
          ) || []),
        ];
      });
      this.expandedCategories = utils.getUnique(expanded_categories);
      return;
    }
    // let ancestors = new Set(
    //   utils
    //     .toArray(this.category)
    //     .map((category) => utils.removeBioLinkPrefix(category))
    //     .reduce((arr, category) => [...arr, ...biolink.getAncestorClasses(category)], [])
    //     .filter((category) => !utils.toArray(this.category).includes(`biolink:${category}`)),
    // );
    let categories = utils
      .toArray(this.categories)
      .map(category => utils.removeBioLinkPrefix(category));
    Object.values(this.equivalentIDs).map(entity => {
      categories = [...categories, ...entity.primaryTypes];
    });
    this.expandedCategories = utils.getUnique(
      utils
        .getUnique(categories)
        .reduce(
          (arr, category) => [
            ...arr,
            ...(utils.biolink.getDescendantClasses(category) || []),
          ],
          [],
        ),
    );
    // .filter(category => !ancestors.has(category));
  }

  getEntities(): SRIBioEntity[] {
    return Object.values(this.equivalentIDs);
  }

  getPrimaryIDs(): string[] {
    return this.getEntities().map(entity => entity.primaryID);
  }

  setEquivalentIDs(equivalentIDs: SRIResolvedSet): void {
    this.equivalentIDs = equivalentIDs;
    this.equivalentIDsUpdated = true;
  }

  updateEquivalentIDs(equivalentIDs: SRIResolvedSet): void {
    if (this.equivalentIDs === undefined) {
      this.equivalentIDs = equivalentIDs;
    } else {
      this.equivalentIDs = { ...this.equivalentIDs, ...equivalentIDs };
    }
    this.equivalentIDsUpdated = true;
  }

  hasInput(): boolean {
    return !(this.curie === undefined || this.curie === null);
  }

  hasEquivalentIDs(): boolean {
    return !(typeof this.equivalentIDs === "undefined");
  }

  getEntityCount(): number {
    return this.curie ? this.curie.length : 0;
  }
}
