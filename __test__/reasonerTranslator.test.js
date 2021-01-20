const translator = require("../src/controllers/reasonerTranslator");

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
                    "id": "qg2",
                    "type": "gene"
                }
            ]
        };
        rt = new translator(queryGraph);
    });

    test("Testing the restructureNodes() function", () => {
        rt.restructureNodes();
        expect(rt.nodes).toHaveProperty("qg0");
    });

    test("Testing the extractAllInputs() function", () => {
        rt.extractAllInputs();
        expect(rt.inputs).toHaveProperty("Disease");
        expect(rt.inputs.Disease).toHaveLength(2);
    });

    test("Testing the findMetaKGEdges() function", () => {
        const edge = 'Gene-related_to-Disease';
        const meta_kg_edges = rt.findMetaKGEdges(edge);
        expect(meta_kg_edges.length).toBeGreaterThan(1);
        const edge2 = 'Gene-functional_association-Pathway';
        const meta_kg_edges2 = rt.findMetaKGEdges(edge2);
        expect(meta_kg_edges2.length).toBe(2);
        const edge3 = 'Gene1-functional_association-Pathway';
        const meta_kg_edges3 = rt.findMetaKGEdges(edge3);
        expect(meta_kg_edges3.length).toBe(0);
    })
});