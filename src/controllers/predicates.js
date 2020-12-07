const meta_kg = require("@biothings-explorer/smartapi-kg");
const snakeCase = require("snake-case");


// module.exports = () => {
//     let predicates = {};
//     kg.ops.map(op => {
//         let input = snakeCase.snakeCase(op.association.input_type);
//         let output = snakeCase.snakeCase(op.association.output_type);
//         let pred = snakeCase.snakeCase(op.association.predicate);
//         if (!(input in predicates)) {
//             predicates[input] = {};
//         }
//         if (!(output in predicates[input])) {
//             predicates[input][output] = [];
//         }
//         if (!(predicates[input][output].includes(pred))) {
//             predicates[input][output].push(pred);
//         }
//     })
//     return predicates;
// }

module.exports = class PredicatesHandler {
    constructor(smartapiID = undefined, version = "1.0.0") {
        this.smartapiID = smartapiID;
        this.version = version;
    }

    async _loadMetaKG(smartapiID) {
        const kg = new meta_kg();
        if (smartapiID === undefined) {
            await kg.constructMetaKG(false, "translator", undefined);
            return kg;
        } else {
            await kg.constructMetaKG(false, "translator", smartapiID);
            return kg;
        }
    }

    _modifyCategory(category, version = "1.0.0") {
        if (version === "1.0.0") {
            if (category.startsWith("biolink:")) {
                return category;
            } else {
                return "biolink:" + category;
            }
        } else {
            return snakeCase.snakeCase(category);
        }
    }

    _modifyPredicate(predicate, version = "1.0.0") {
        if (version === "1.0.0") {
            if (predicate.startsWith("biolink:")) {
                return predicate;
            } else {
                return "biolink:" + snakeCase.snakeCase(predicate);
            }
        } else {
            return snakeCase.snakeCase(predicate);
        }
    }

    async getPredicates(smartapiID = this.smartapiID, version = this.version) {
        const kg = await this._loadMetaKG(smartapiID);
        let predicates = {};
        kg.ops.map(op => {
            let input = this._modifyCategory(op.association.input_type, version);
            let output = this._modifyCategory(op.association.output_type, version);
            let pred = this._modifyPredicate(op.association.predicate, version);
            if (!(input in predicates)) {
                predicates[input] = {};
            }
            if (!(output in predicates[input])) {
                predicates[input][output] = [];
            }
            if (!(predicates[input][output].includes(pred))) {
                predicates[input][output].push(pred);
            }
        })
        return predicates;
    }


}