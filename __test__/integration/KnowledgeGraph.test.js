const QNode = require("../../src/controllers/QueryGraphHandler/query_node");
const QEdge = require("../../src/controllers/QueryGraphHandler/query_edge");
const KnowledgeGraph = require("../../src/controllers/QueryGraphHandler/knowledge_graph");

describe("Testing KnowledgeGraph Module", () => {
    const gene_node1 = new QNode("n1", { category: "Gene", id: "NCBIGene:1017" });
    const chemical_node1 = new QNode("n3", { category: "ChemicalSubstance" });
    const edge1 = new QEdge("e01", { subject: gene_node1, object: chemical_node1 });
    describe("Testing _createInputNode function", () => {
        test("test when input with string, should output a hash of 40 characters", () => {
            const record = {
                "$reasoner_edge": edge1,
                "$input": "SYMBOL:CDK2",
                "id": "CHEMBL.COMPOUND:CHEMBL354634",
                "$original_input": {
                    "SYMBOL:CDK2": "NCBIGene:1017"
                },
                "$input_resolved_identifiers": {
                    "NCBIGene:1017": {
                        id: {
                            label: "CDK2"
                        }
                    }
                },
                "label": "DRUG A"
            }
            const kg = new KnowledgeGraph();
            const res = kg._createInputNode(record);
            expect(res).toHaveProperty("NCBIGene:1017");
            expect(res["NCBIGene:1017"]).toHaveProperty("name", "CDK2");
            expect(res["NCBIGene:1017"]).toHaveProperty("category", "biolink:Gene");
        })
    })

    describe("Testing _createOutputNode function", () => {
        test("test when input with string, should output a hash of 40 characters", () => {
            const record = {
                "$reasoner_edge": edge1,
                "$input": "SYMBOL:CDK2",
                "id": "CHEMBL.COMPOUND:CHEMBL354634",
                "$original_input": {
                    "SYMBOL:CDK2": "NCBIGene:1017"
                },
                "$input_resolved_identifiers": {
                    "NCBIGene:1017": {
                        id: {
                            label: "CDK2"
                        }
                    }
                },
                "label": "DRUG A"
            }
            const kg = new KnowledgeGraph();
            const res = kg._createOutputNode(record);
            expect(res["CHEMBL.COMPOUND:CHEMBL354634"]).toHaveProperty("name", "DRUG A");
            expect(res["CHEMBL.COMPOUND:CHEMBL354634"]).toHaveProperty("category", "biolink:ChemicalSubstance");
        })
    })

})