const meta_kg = require("@biothings-explorer/smartapi-kg");
const kg = new meta_kg();
const fs = require("fs");
var path = require('path');
const util = require('util');
const readFile = util.promisify(fs.readFile);

module.exports = async (sub, obj, pred, api, source) => {
    const smartapi_specs = await readFile(path.resolve(__dirname, '../../data/smartapi_specs.json'));
    const data = JSON.parse(smartapi_specs);
    kg.constructMetaKGFromUserProvidedSpecs(data);
    let associations = [];
    let filtered_res = kg.filter({
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