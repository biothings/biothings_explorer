const meta_kg = require("@biothings-explorer/smartapi-kg");
const kg = new meta_kg();
META_KG_CONSTRUCTED = false

module.exports = async (sub, obj, pred, api, source) => {
    if (META_KG_CONSTRUCTED === false) {
        await kg.constructMetaKG(true);
        META_KG_CONSTRUCTED = true
    }
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