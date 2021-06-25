const meta_kg = require("@biothings-explorer/smartapi-kg");
const fs = require("fs");
var path = require('path');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const debug = require("debug")("bte:biothings-explorer-trapi:metakg");

module.exports = async (sub = undefined, obj = undefined, pred = undefined, api = undefined, source = undefined) => {
    const smartapi_specs = path.resolve(__dirname, '../../data/smartapi_specs.json');
    debug(`smartapi specs loaded: ${smartapi_specs}`)
    const predicates = path.resolve(__dirname, '../../data/predicates.json');
    debug(`predicates endpoints loaded, ${predicates}`)
    const kg = new meta_kg.default(smartapi_specs, predicates);
    debug("metakg initialized")
    kg.constructMetaKGSync(true, {});
    debug(`metakg loaded: ${kg.ops.length} ops`)
    const associations = [];
    const filtered_res = kg.filter({
        input_type: sub,
        output_type: obj,
        predicate: pred,
        api_name: api,
        source: source
    })
    filtered_res.map(op => {
        associations.push({
            subject: op.association.input_type,
            object: op.association.output_type,
            predicate: op.association.predicate,
            provided_by: op.association.source,
            api: {
                name: op.association.api_name,
                smartapi: {
                    metadata: op.association.smartapi.meta.url,
                    id: op.association.smartapi.id,
                    ui: "https://smart-api.info/ui/" + op.association.smartapi.id
                },
                "x-translator": op.association["x-translator"]
            }
        });
    })
    return associations;
}