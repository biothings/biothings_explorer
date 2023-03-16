const axios = require("axios");

const TYPE_TO_ID_MAPPING = {
    "Gene": "NCBIGene",
    "SmallMolecule": "CHEBI",
    "AnatomicalEntity": "UBERON",
    "BiologicalProcess": "GO",
    "MolecularActivity": "GO",
    "Cell": "CL",
    "SequenceVariant": "SO",
    "Disease": "MONDO",
    "PhenotypicFeature": "HP",
}

module.exports = class NGDFilter {
    constructor(queryResult, criteria) {
        this.queryResult = queryResult;
        this.criteria = criteria;
    }

    extractInputID(resolvedIDs, semanticType) {
        if (resolvedIDs === undefined) {
            return undefined
        }
        if (!(semanticType in TYPE_TO_ID_MAPPING)) {
            return undefined;
        }
        if (!("db_ids" in resolvedIDs)) {
            return undefined;
        }
        let prefix = TYPE_TO_ID_MAPPING[semanticType];
        if (!(prefix in resolvedIDs["db_ids"])) {
            return undefined;
        }
        return resolvedIDs.db_ids[prefix][0]
    }

    async queryNGD(inputs) {
        let result = [];
        let i, j, tmp;
        for (i = 0, j = inputs.length; i < j; i += 1000) {
            let query = {
                "q": inputs.slice(i, i + 1000).map(item => item.split('-')),
                "scopes": [["subject.id", "object.id"], ["object.id", "subject.id"]],
                "fields": "association.ngd",
                "dotfield": true
            }
            const userAgent = `BTE/${process.env.NODE_ENV === 'production' ? 'prod' : 'dev'} Node/${process.version} ${process.platform}`;
            tmp = await axios.post("https://biothings.ncats.io/text_mining_co_occurrence_kp/query",
                JSON.stringify(query),
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'User-Agent': userAgent,
                    }
                })
            result = [...result, ...tmp.data];
        }
        return result;
    }

    parseResponse(res) {
        let result = {};
        res.map(rec => {
            if ("association.ngd" in rec) {
                result[rec["query"].join("-")] = rec["association.ngd"];
            }
        });
        return result;
    }

    async annotateNGD() {
        let ngd_inputs = new Set();
        let id_dict = {};
        if (Array.isArray(this.queryResult) && this.queryResult.length > 0) {
            this.queryResult.map((record, i) => {
                if ("$association" in record) {
                    let input_type = record["$association"]["input_type"];
                    let output_type = record["$association"]["output_type"];
                    let input_resolved_ids = record["$input_resolved_identifiers"][record["$original_input"][record["$input"]]];
                    if (!("resolved" in record["$output_id_mapping"])) {
                        return;
                    }
                    let output_resolved_ids = record["$output_id_mapping"]["resolved"];
                    let input_id = this.extractInputID(input_resolved_ids, input_type);
                    let output_id = this.extractInputID(output_resolved_ids, output_type);
                    if (input_id !== undefined && output_id !== undefined) {
                        let s_id = String(input_id);
                        let o_id = String(output_id);
                        if (input_type === "Gene") {
                            s_id = 'NCBIGene:' + s_id;
                        }
                        if (output_type === "Gene") {
                            o_id = 'NCBIGene:' + o_id;
                        }
                        ngd_inputs.add(s_id + '-' + o_id);
                        id_dict[i] = s_id + '-' + o_id;
                    }
                }
            });
            let ngd_results = await this.queryNGD(Array.from(ngd_inputs));
            let parsed_ngd_results = this.parseResponse(ngd_results);
            this.queryResult.map((rec, i) => {
                if (i in id_dict) {
                    rec["$ngd"] = parsed_ngd_results[id_dict[i]];
                }
            })
        }
    }
}
