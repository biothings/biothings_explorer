const fs = require("fs");
var path = require('path');
const debug = require("debug")("biothings-explorer-trapi:EdgeReverse")

class EdgeReverse {
    constructor() {
        if (!EdgeReverse.instance) {
            debug("Edge Reverse class is initiated.")
            let biolink = fs.readFileSync(path.resolve(__dirname, './biolink.json'));
            this.data = JSON.parse(biolink);
        }

        return EdgeReverse.instance;
    }

    reverse(predicate) {
        if (typeof predicate === "string") {
            let modifiedPredicate = predicate.replace('_', ' ');
            if (modifiedPredicate in this.data.slots) {
                if (this.data.slots[modifiedPredicate].symmetric === true) {
                    return modifiedPredicate.replace(' ', '_');
                }
                if ('inverse' in this.data.slots[modifiedPredicate]) {
                    return this.data.slots[modifiedPredicate].inverse.replace(' ', '_');
                }
            }
        }

        return undefined;
    }
}

const EdgeReverseInstance = new EdgeReverse();
Object.freeze(EdgeReverseInstance);

module.exports = EdgeReverseInstance;