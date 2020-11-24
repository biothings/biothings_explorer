const _ = require("lodash");

module.exports = class QNode {
    /**
     * 
     * @param {string} id - QNode ID
     * @param {object} info - Qnode info, e.g. curie, category
     */
    constructor(id, info) {
        this.id = id;
        this.category = info.category;
        this.curie = info.id;
    }

    getID() {
        return this.id;
    }

    getCategory() {
        return this.category;
    }

    getCurie() {
        return this.curie;
    }

    getEquivalentIDs() {
        return this.equivalentIDs;
    }

    setEquivalentIDs(equivalentIDs) {
        this.equivalentIDs = equivalentIDs;
    }

    hasInput() {
        return !(typeof this.curie === "undefined");
    }

    hasEquivalentIDs() {
        return !(typeof this.equivalentIDs === "undefined");
    }
}