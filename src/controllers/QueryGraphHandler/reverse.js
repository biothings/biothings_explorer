const fs = require("fs");
var path = require('path');

module.exports = class EdgeReverse {
    constructor() {
        let biolink = fs.readFileSync(path.resolve(__dirname, './biolink.json'));
        this.data = JSON.parse(biolink);
    }

    reverse(predicate) {
        if (typeof predicate === "string") {
            let modifiedPredicate = predicate.replace('_', ' ');
            if (modifiedPredicate in this.data.slots) {
                if ('inverse' in this.data.slots[modifiedPredicate]) {
                    return this.data.slots[modifiedPredicate].inverse.replace(' ', '_');
                }
            }
        }

        return undefined;
    }
}