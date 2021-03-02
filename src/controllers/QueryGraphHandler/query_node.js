const _ = require("lodash");
const utils = require("../utils");

module.exports = class QNode {
    /**
     * 
     * @param {string} id - QNode ID
     * @param {object} info - Qnode info, e.g. curie, category
     */
    constructor(id, info) {
        this.id = id;
        this.category = info.category || "NamedThing";
        this.curie = info.id;
    }

    getID() {
        return this.id;
    }

    getCategory() {
        return utils.removeBioLinkPrefix(this.category);
    }

    getCurie() {
        return this.curie;
    }

    getEquivalentIDs() {
        return this.equivalentIDs;
    }

    getCategories() {
        if (this.hasEquivalentIDs() === false) {
            const categories = utils.toArray(this.category);
            return utils.getUnique(categories.map(category => utils.removeBioLinkPrefix(category)));
        }
        let categories = [];
        Object.values(this.equivalentIDs).map(entities => {
            entities.map(entity => {
                categories = [...categories, ...entity.semanticTypes];
            })
        })
        return utils.getUnique(categories);
    }

    getEntities() {
        return Object.values(this.equivalentIDs).reduce((res, entities) => {
            return [...res, ...entities];
        }, []);
    }

    setEquivalentIDs(equivalentIDs) {
        this.equivalentIDs = equivalentIDs;
    }

    updateEquivalentIDs(equivalentIDs) {
        if (this.equivalentIDs === undefined) {
            this.equivalentIDs = equivalentIDs
        } else {
            this.equivalentIDs = { ...this.equivalentIDs, ...equivalentIDs };
        }
    }

    hasInput() {
        return !(typeof this.curie === "undefined");
    }

    hasEquivalentIDs() {
        return !(typeof this.equivalentIDs === "undefined");
    }
}