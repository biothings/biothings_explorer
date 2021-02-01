const fs = require("fs");
var path = require('path');

module.exports = class EdgeReverse {
    constructor() {
        let biolink = fs.readFileSync(path.resolve(__dirname, './biolink.json'));
        this.data = JSON.parse(biolink);
    }

    reverse(predicate) {
        if (predicate in this.data.slots) {
            if ('inverse' in this.data.slots[predicate]) {
                return this.data.slots[predicate].inverse.replace(' ', '_');
            }
        }
        return undefined;
    }
}