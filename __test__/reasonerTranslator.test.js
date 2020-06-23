const translator = require("../reasonerTranslator");

describe("Testing Reasoner Std API Query Graph Translator", () => {
    let queryGraph;
    let rt;

    beforeAll(() => {
        queryGraph = {
            "edges": [
                {
                    "id": "qg3",
                    "source_id": "qg1",
                    "target_id": "qg2"
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
                    "type": "disease"
                },
                {
                    "id": "qg1",
                    "name": "hereditary angioedema",
                    "curie": "DOID:14735",
                    "type": "disease"
                },
                {
                    "id": "qg2"
                }
            ]
        };
        rt = new translator(queryGraph);
    });

    test("Testing the restructureNodes() function", () => {
        rt.restructureNodes();
        expect(rt.nodes).toHaveProperty("qg0");
    })
});