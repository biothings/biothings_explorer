const rt = require("./reasonerTranslator");
const queryGraph = {
    "edges": [
        {
            "id": "qg3",
            "source_id": "qg0",
            "relation": "caused_by",
            "target_id": "qg6"
        },
        {
            "id": "qg4",
            "source_id": "qg0",
            "target_id": "qg2"
        }
    ],
    "nodes": [
        {
            "id": "qg0",
            "name": "viral pneumonia",
            "curie": "DOID:10533",
            "type": "Disease"
        },
        {
            "id": "qg1",
            "name": "hereditary angioedema",
            "curie": "DOID:14735",
            "type": "Disease"
        },
        {
            "id": "qg2",
            "type": "Gene"
        },
        {
            "id": "qg6",
            "type": "ChemicalSubstance"
        }
    ]
};

const tf = async () => {
    let rt1 = new rt(queryGraph);
    //console.log(rt1.findQueryGraphNodeID("DOID:10533"))
    await rt1.queryPlan();
    await rt1.queryExecute();
    //console.log(rt1.query_result);
    rt1.responseTranslate();
    console.log(rt1.reasonStdAPIResponse.results[0]);
}

tf();